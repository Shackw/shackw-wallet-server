import { Module } from "@nestjs/common";

import { AppCheckService } from "@/application/services/app-check.service";
import { AppCheckGuard } from "@/interfaces/guards/app-check.guard";

@Module({
  providers: [AppCheckService, AppCheckGuard],
  exports: [AppCheckService, AppCheckGuard]
})
export class AppCheckModule {}
