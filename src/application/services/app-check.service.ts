import { Injectable, UnauthorizedException } from "@nestjs/common";

import { firebaseAppCheck } from "@/config/firebase.config";

@Injectable()
export class AppCheckService {
  async verifyToken(token: string) {
    try {
      const result = await firebaseAppCheck.verifyToken(token);
      return result;
    } catch {
      throw new UnauthorizedException("Invalid App Check token");
    }
  }
}
