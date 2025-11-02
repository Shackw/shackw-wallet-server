import { Module } from "@nestjs/common";

import { FeesService } from "@/application/services/fees.service";
import { QuotesService } from "@/application/services/quotes.service";
import { TokenService } from "@/application/services/token.service";

import { InfrastructureModule } from "./infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [FeesService, QuotesService, TokenService],
  exports: [FeesService, QuotesService, TokenService]
})
export class ApplicationModule {}
