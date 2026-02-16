import { Injectable } from "@nestjs/common";

import { ApplicationError } from "@/application/errors";
import { firebaseAppCheck } from "@/config/firebase.config";

@Injectable()
export class AppCheckService {
  async verifyToken(token: string) {
    try {
      return await firebaseAppCheck.verifyToken(token);
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
