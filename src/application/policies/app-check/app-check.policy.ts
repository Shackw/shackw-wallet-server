import { Inject, Injectable } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import { AppCheckAdapter } from "@/application/ports/adapters/app-check.adapter.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { VerifyAppCheckTokenInput } from "./app-check.policy.type";

@Injectable()
export class AppCheckPolicy {
  constructor(
    @Inject(DI_TOKENS.APP_CHECK_ADAPTER)
    private readonly appCheckAdapter: AppCheckAdapter
  ) {}

  async verify(input: VerifyAppCheckTokenInput): Promise<void> {
    try {
      return await this.appCheckAdapter.verifyToken({ token: input.token });
    } catch (e) {
      throw new ApplicationError({
        code: "UNAUTHORIZED",
        message: "Invalid App Check token",
        httpStatus: 401,
        cause: e
      });
    }
  }
}
