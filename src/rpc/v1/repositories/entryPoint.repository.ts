import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Hex, PublicClient } from "viem";

import { EntryPointAbi } from "../constants/abis/entryPointAbi";
import { RpcInternalErrorException } from "../libs/rpc-custom-exceptions";
import { UserOperationModel } from "../models/userOperation";
import { VIEM_PUBLIC_CLIENT } from "../tokens";

export interface IEntryPointRepository {
  getUserOpHash(userOp: UserOperationModel): Promise<Hex>;
}

@Injectable()
export class ViemEntryPointRepository implements IEntryPointRepository {
  private readonly entryPoint: Hex;

  constructor(
    @Inject(VIEM_PUBLIC_CLIENT) private readonly client: PublicClient,
    cfg: ConfigService
  ) {
    this.entryPoint = cfg.get<string>("ENTRY_POINT_ADDRESS", { infer: true }) as Hex;
  }

  async getUserOpHash(userOp: UserOperationModel): Promise<Hex> {
    try {
      const hash = await this.client.readContract({
        address: this.entryPoint,
        abi: EntryPointAbi,
        functionName: "getUserOpHash",
        args: [userOp]
      });
      return hash;
    } catch (err) {
      throw new RpcInternalErrorException("failed to read getUserOpHash", err);
    }
  }
}
