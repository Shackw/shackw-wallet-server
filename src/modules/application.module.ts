import { Module } from "@nestjs/common";

import { FeesService } from "@/application/services/fees.service";
import { MetaService } from "@/application/services/meta.service";
import { QuotesService } from "@/application/services/quotes.service";
import { TokenService } from "@/application/services/token.service";

import { InfrastructureModule } from "./infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [FeesService, QuotesService, TokenService, MetaService],
  exports: [FeesService, QuotesService, TokenService, MetaService]
})
export class ApplicationModule {}
