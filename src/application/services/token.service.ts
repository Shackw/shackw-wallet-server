import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { getContract } from "viem";
import { verifyAuthorization } from "viem/utils";

import { ENV } from "@/config/env.config";
import { TransferTokenModel } from "@/domain/entities/token.entity";
import { DELEGATE_ABI } from "@/infrastructure/evm/abis/delegate.abi";
import { REGISTRY_ABI } from "@/infrastructure/evm/abis/registry.abi";
import { QuoteToken } from "@/infrastructure/evm/types/quote-token.type";
import { erc20TransferCall, hashExecutionIntent } from "@/infrastructure/evm/utils/evm-intent.util";
import { decodeQuoteToken } from "@/infrastructure/evm/utils/quote-token.util";
import { startSettlementWebhookJob } from "@/infrastructure/workers/settlement/settlement.worker";
import { TransferTokenRequestDto } from "@/interfaces/dto/token.dto";
import { BadRequestWithCodeException } from "@/interfaces/exceptions/bad-request-with-code.exception";
import {
  REGISTRY_CONTRACT_ADDRESS_REGISTORY,
  DELEGATE_CONTRACT_ADDRESS_REGISTORY
} from "@/registries/invoker.registry";
import { SPONSOR_CLIENTS } from "@/registries/sponser.registry";
import { ADDRESS_TO_TOKEN, TOKEN_REGISTRY } from "@/registries/token.registry";
import { VIEM_PUBLIC_CLIENTS } from "@/registries/viem.registry";

@Injectable()
export class TokenService {
  async transferToken(dto: TransferTokenRequestDto): Promise<TransferTokenModel> {
    const { chain, quoteToken, authorization, notify } = dto;

    const registryContract = getContract({
      abi: REGISTRY_ABI,
      address: REGISTRY_CONTRACT_ADDRESS_REGISTORY[chain],
      client: VIEM_PUBLIC_CLIENTS[chain]
    });

    // 1) Verify & decode quoteToken (HMAC integrity)
    let decodedToken: QuoteToken;
    try {
      decodedToken = decodeQuoteToken(quoteToken, ENV.QUOTE_TOKEN_SECRET);
    } catch (e) {
      throw new BadRequestException("Invalid quoteToken.", { cause: e });
    }

    const {
      v,
      chainId,
      sender,
      recipient,
      token,
      feeToken,
      amountMinUnits,
      feeMinUnits,
      delegate,
      sponsor,
      expiresAt,
      nonce,
      callHash
    } = decodedToken;

    // 2) Basic validation: version & expiration
    if (v !== 1) throw new BadRequestException("Unsupported quoteToken version: v must be 1.");

    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    if (nowSec > expiresAt + 15n) throw new ForbiddenException("Quote expired (15s grace).");

    // 2b) Environment consistency
    const delegateAddress = DELEGATE_CONTRACT_ADDRESS_REGISTORY[chain];
    if (delegate !== delegateAddress)
      throw new BadRequestException(`Delegate mismatch: expected ${delegateAddress}, got ${delegate}.`);
    if (sponsor !== ENV.SPONSOR_ADDRESS)
      throw new BadRequestException(`Sponsor mismatch: expected ${ENV.SPONSOR_ADDRESS}, got ${sponsor}.`);

    // 3) Rebuild calls and recompute callHash to ensure integrity
    const transferAmountCallData = erc20TransferCall({
      token,
      to: recipient,
      amountMinUnits
    });
    const transferFeeCallData = erc20TransferCall({
      token: feeToken,
      to: sponsor,
      amountMinUnits: feeMinUnits
    });
    const expectedCallHash = hashExecutionIntent({
      chainId,
      sender,
      calls: [transferAmountCallData, transferFeeCallData],
      expiresAtSec: expiresAt,
      nonce
    });
    if (callHash !== expectedCallHash)
      throw new BadRequestException("Call hash mismatch: quoteToken payload does not match.");

    // 4) Replay protection: ensure nonce is fresh
    const expectedNonce = await registryContract.read.nextNonce([sender]);
    if (nonce !== expectedNonce)
      throw new BadRequestException(
        `Stale nonce: quoteToken.nonce=${nonce.toString()} does not match registry.nextNonce=${expectedNonce.toString()} for ${sender}.`
      );

    // 5) Verify EIP-7702 authorization for the sender EOA
    const validAuth = await verifyAuthorization({ address: sender, authorization });
    if (!validAuth) throw new ForbiddenException("Invalid 7702 authorization.");

    // 6) Sender balance checks for token and feeToken
    const tokenSym = (() => {
      try {
        return ADDRESS_TO_TOKEN[chain][token.toLowerCase()];
      } catch {
        throw new BadRequestException(`Unknown token address: ${token}`);
      }
    })();

    const feeTokenSym = (() => {
      try {
        return ADDRESS_TO_TOKEN[chain][feeToken.toLowerCase()];
      } catch {
        throw new BadRequestException(`Unknown feeToken address: ${feeToken}`);
      }
    })();

    const erc20Contract = TOKEN_REGISTRY[tokenSym].contract[chain];
    const balToken = await erc20Contract.read.balanceOf([sender]);

    if (tokenSym === feeTokenSym) {
      const required = amountMinUnits + feeMinUnits;
      if (balToken < required)
        throw new BadRequestWithCodeException(
          "InsufficientCombinedBalance",
          `Insufficient ${tokenSym} balance: required ${required} minimal units (amount ${amountMinUnits} + fee ${feeMinUnits}), but sender has ${balToken}.`
        );
    } else {
      const erc20ContractWithFee = TOKEN_REGISTRY[feeTokenSym].contract[chain];
      const balFeeToken = await erc20ContractWithFee.read.balanceOf([sender]);

      if (balToken < amountMinUnits)
        throw new BadRequestWithCodeException(
          "InsufficientSendBalance",
          `Insufficient ${tokenSym} balance: required ${amountMinUnits} minimal units, but sender has ${balToken}.`
        );
      if (balFeeToken < feeMinUnits)
        throw new BadRequestWithCodeException(
          "InsufficientFeeBalance",
          `Insufficient ${feeTokenSym} balance for fee: required ${feeMinUnits} minimal units, but sender has ${balFeeToken}.`
        );
    }

    // 7) Simulate and send execute() to the sender EOA (EIP-7702)
    const DELEGATE_EXECUTE_TX = {
      abi: DELEGATE_ABI,
      address: sender,
      functionName: "execute",
      args: [[transferAmountCallData, transferFeeCallData], expectedNonce, expiresAt, expectedCallHash],
      authorizationList: [authorization],
      value: 0n
    } as const;

    // 7a) Simulate with sponsor; throw 400 on failure.
    await VIEM_PUBLIC_CLIENTS[chain]
      .simulateContract({
        ...DELEGATE_EXECUTE_TX,
        account: ENV.SPONSOR_ADDRESS
      })
      .catch(e => {
        throw new BadRequestException("Simulation failed.", { cause: e });
      });

    // 7b) Send transaction; obtain txHash.
    const txHash = await SPONSOR_CLIENTS[chain].writeContract(DELEGATE_EXECUTE_TX).catch(e => {
      throw new BadRequestException("Transaction send failed.", { cause: e });
    });

    // 7c) Fire-and-forget settlement worker.
    if (notify?.webhook) startSettlementWebhookJob({ chain, txHash, webhook: notify.webhook });

    // 7d) Return immediately with submission info (confirmation handled by worker).
    return { status: "submitted", txHash, notify };
  }
}
