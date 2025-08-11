import { Injectable, Inject } from "@nestjs/common";
import { concatHex, encodeAbiParameters, keccak256 } from "viem";

import {
  PreparePaymasterAndDataInput,
  PreparePaymasterAndDataModel,
  SendUserOperationInput,
  SendUserOperationModel
} from "../models/userOperation";
import { PaymasterRegistry, SignerRegistry } from "../providers/registries.provider";
import { IEntryPointRepository } from "../repositories/entryPoint.repository";
import { IPaymasterRepository } from "../repositories/paymaster.repository";
import { ENTRY_POINT_REPOSITORY, PAYMASTER_REGISTRY, PAYMASTER_REPOSITORY, SIGNER_REGISTRY } from "../tokens";

@Injectable()
export class UserOperationService {
  constructor(
    @Inject(SIGNER_REGISTRY)
    private readonly signerRegistry: SignerRegistry,

    @Inject(PAYMASTER_REGISTRY)
    private readonly paymasterRegistry: PaymasterRegistry,

    @Inject(ENTRY_POINT_REPOSITORY)
    private readonly entryPointRepository: IEntryPointRepository,

    @Inject(PAYMASTER_REPOSITORY)
    private readonly paymasterRepository: IPaymasterRepository
  ) {}

  async prepare(inputs: PreparePaymasterAndDataInput[]): Promise<PreparePaymasterAndDataModel> {
    const { userOperation, paymasterKind, amount } = inputs[0];

    // Get the trusted signer for this paymaster kind
    const signer = this.signerRegistry.get(paymasterKind);

    // Get the paymaster contract address
    const { address: paymasterAddr } = this.paymasterRegistry.get(paymasterKind);

    // 1) Calculate userOpHash from EntryPoint
    const userOpHash = await this.entryPointRepository.getUserOpHash(userOperation);

    // 2) Calculate quoted fee (for UI display only, not embedded in paymasterAndData)
    const quotedFee = await this.paymasterRepository.getTransferFee(paymasterKind, amount);

    // 3) Set validity window (now to now+600s)
    const now = Math.floor(Date.now() / 1000);
    const validAfter = now;
    const validUntil = now + 600;

    // 4) Create hash exactly as in _verifySignature() in the contract
    const hash = keccak256(
      encodeAbiParameters(
        [{ type: "bytes32" }, { type: "uint48" }, { type: "uint48" }, { type: "uint256" }],
        [userOpHash, validUntil, validAfter, amount]
      )
    );

    // 5) Sign the hash (EIP-191 / toEthSignedMessageHash)
    const signature = await signer.signMessage({ raw: hash });

    // 6) Encode paymaster-specific payload
    const payload = encodeAbiParameters(
      [{ type: "uint48" }, { type: "uint48" }, { type: "uint256" }, { type: "bytes" }],
      [validUntil, validAfter, amount, signature]
    );

    // 7) Combine paymaster address and payload
    const paymasterAndData = concatHex([paymasterAddr, payload]);

    // 8) Return RPC model
    return {
      paymasterAndData,
      signature,
      validAfter,
      validUntil,
      quotedFee
    };
  }

  async send(inputs: SendUserOperationInput[]): Promise<SendUserOperationModel> {
    console.log(inputs);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      requestId: "0x000",
      userOpHash: "0x"
    };
  }
}
