import { Injectable, Inject } from "@nestjs/common";
import { PublicClient } from "viem";

import { VIEM_PUBLIC_CLIENT } from "../tokens";

@Injectable()
export class UserOperationService {
  constructor(@Inject(VIEM_PUBLIC_CLIENT) private readonly client: PublicClient) {}
}
