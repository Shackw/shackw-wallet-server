import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { getContract } from "viem";
import { verifyAuthorization } from "viem/utils";

import { ENV } from "@/configs/env.config";
import { SPONSOR_CLIENT } from "@/configs/sponser.config";
import { VIEM_PUBLIC_CLIENT } from "@/configs/viem.config";
import { DELEGATE_ABI } from "@/evm/abis/delegate.abi";
import { REGISTRY_ABI } from "@/evm/abis/registry.abi";
import { QuoteToken } from "@/evm/types/quote-token.type";
import { erc20TransferCall, hashExecutionIntent } from "@/evm/utils/evm-intent.util";
import { decodeQuoteToken } from "@/evm/utils/quote-token.util";
import { ADDRESS_TO_TOKEN, TOKEN_REGISTRY } from "@/registries/token.registry";
import { startSettlementWebhookJob } from "@/workers/settlement/settlement.worker";

import { TransferTokenDto } from "../dtos/token.dto";
import { TransferTokenResponseModel } from "../models/token.model";

@Injectable()
export class TokenService {
  async transferToken(dto: TransferTokenDto): Promise<TransferTokenResponseModel> {
    const { quoteToken, authorization, notify } = dto;

    const registryContract = getContract({
      abi: REGISTRY_ABI,
      address: ENV.REGISTRY_ADDRESS,
      client: VIEM_PUBLIC_CLIENT
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
    if (delegate !== ENV.DELEGATE_ADDRESS)
      throw new BadRequestException(`Delegate mismatch: expected ${ENV.DELEGATE_ADDRESS}, got ${delegate}.`);
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
    const tokenSym = ADDRESS_TO_TOKEN[token.toLowerCase()];
    if (!tokenSym) throw new BadRequestException(`Unknown token address: ${token}`);

    const feeTokenSym = ADDRESS_TO_TOKEN[feeToken.toLowerCase()];
    if (!feeTokenSym) throw new BadRequestException(`Unknown feeToken address: ${feeToken}`);

    const erc20Contract = TOKEN_REGISTRY[tokenSym].contract;
    const balToken = await erc20Contract.read.balanceOf([sender]);

    if (tokenSym === feeTokenSym) {
      const required = amountMinUnits + feeMinUnits;
      if (balToken < required)
        throw new BadRequestException(
          `Insufficient ${tokenSym} balance: required ${required} minimal units (amount ${amountMinUnits} + fee ${feeMinUnits}), but sender has ${balToken}.`
        );
    } else {
      const erc20ContractWithFee = TOKEN_REGISTRY[feeTokenSym].contract;
      const balFeeToken = await erc20ContractWithFee.read.balanceOf([sender]);

      if (balToken < amountMinUnits)
        throw new BadRequestException(
          `Insufficient ${tokenSym} balance: required ${amountMinUnits} minimal units, but sender has ${balToken}.`
        );
      if (balFeeToken < feeMinUnits)
        throw new BadRequestException(
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
    await VIEM_PUBLIC_CLIENT.simulateContract({
      ...DELEGATE_EXECUTE_TX,
      account: ENV.SPONSOR_ADDRESS
    }).catch(e => {
      throw new BadRequestException("Simulation failed.", { cause: e });
    });

    // 7b) Send transaction; obtain txHash.
    const txHash = await SPONSOR_CLIENT.writeContract(DELEGATE_EXECUTE_TX).catch(e => {
      throw new BadRequestException("Transaction send failed.", { cause: e });
    });

    // 7c) Fire-and-forget settlement worker.
    if (notify?.webhook) startSettlementWebhookJob({ txHash, chainId, webhook: notify.webhook });

    // 7d) Return immediately with submission info (confirmation handled by worker).
    return { status: "submitted", txHash, notify };
  }
}
