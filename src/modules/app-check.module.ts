import { Module } from "@nestjs/common";

import { AppCheckPolicy } from "@/application/policies/app-check";
import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";

@Module({
  providers: [AppCheckPolicy, AppCheckGuard],
  exports: [AppCheckPolicy, AppCheckGuard]
})
export class AppCheckModule {}
