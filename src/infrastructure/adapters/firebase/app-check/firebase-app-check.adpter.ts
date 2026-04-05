import { Inject, Logger } from "@nestjs/common";

import type { AppCheckAdapter, AppCheckVerifyTokenQuery } from "@/application/ports/adapters/app-check.adapter.port";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import type { AppCheck } from "firebase-admin/app-check";

export class FirebaseAppCheckAdapter implements AppCheckAdapter {
  private readonly logger = new Logger(FirebaseAppCheckAdapter.name);

  constructor(
    @Inject(DI_TOKENS.FIREBASE_CLIENT)
    private client: AppCheck
  ) {}

  async verifyToken(query: AppCheckVerifyTokenQuery): Promise<void> {
    try {
      if (process.env.NODE_ENV === "development") return;

      await this.client.verifyToken(query.token);
    } catch (e) {
      this.logger.warn("App Check token verification failed.", e);
      throw e;
    }
  }
}
