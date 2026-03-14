import type { AppCheckAdapter, AppCheckVerifyTokenQuery } from "@/application/ports/adapters/app-check.adapter.port";

export class StubAppCheckAdapter implements AppCheckAdapter {
  verifyToken(_query: AppCheckVerifyTokenQuery): Promise<void> {
    return Promise.resolve();
  }
}
