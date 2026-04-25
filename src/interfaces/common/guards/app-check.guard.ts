import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import { AppCheckPolicy } from "@/application/policies/app-check";
import { DI_TOKENS } from "@/shared/di.tokens";

@Injectable()
export class AppCheckGuard implements CanActivate {
  constructor(
    @Inject(DI_TOKENS.APP_CHECK_POLICY)
    private readonly appCheckPolicy: AppCheckPolicy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { appCheck?: any }>();

    const headers = request.headers as unknown as Record<string, string>;

    const token = headers["x-app-check-token"];

    if (!token) throw new UnauthorizedException("App Check token is required");

    await this.appCheckPolicy.verify({ token });

    return true;
  }
}
