import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { AppCheckService } from "@/application/services/app-check";

@Injectable()
export class AppCheckGuard implements CanActivate {
  constructor(private readonly appCheckService: AppCheckService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { appCheck?: any }>();

    const headers = request.headers as unknown as Record<string, string>;

    const token = headers["x-app-check-token"];

    if (!token) throw new UnauthorizedException("App Check token is required");

    await this.appCheckService.verifyToken(token);

    return true;
  }
}
