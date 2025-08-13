import { Inject, Injectable } from "@nestjs/common";
import { PublicClient } from "viem";

import { PAYMASTER_ABI } from "../../../common/abis/paymasterAbi";
import { RpcInternalErrorException } from "../../../common/jsonrpc/exceptions";
import { PAYMASTER_REGISTRY, VIEM_PUBLIC_CLIENT } from "../common/di.tokens";
import { PaymasterRegistry } from "../providers/registries.provider";
import { PaymasterKind } from "../types/userOperation.types";

export interface IPaymasterRepository {
  getTransferFee(kind: PaymasterKind, amount: bigint): Promise<bigint>;
}

@Injectable()
export class ViemPaymasterRepository implements IPaymasterRepository {
  constructor(
    @Inject(VIEM_PUBLIC_CLIENT)
    private readonly client: PublicClient,

    @Inject(PAYMASTER_REGISTRY)
    private readonly paymasterRegistry: PaymasterRegistry
  ) {}

  async getTransferFee(kind: PaymasterKind, amount: bigint): Promise<bigint> {
    const { address } = this.paymasterRegistry.get(kind);

    try {
      const fee = await this.client.readContract({
        address: address,
        abi: PAYMASTER_ABI,
        functionName: "getTransferFee",
        args: [amount]
      });
      return fee;
    } catch (err) {
      throw new RpcInternalErrorException("failed to read getTransferFee", err);
    }
  }
}
