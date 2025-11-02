import { Module } from "@nestjs/common";

import { FeesController } from "@/interfaces/controllers/fees.controller";
import { QuotesController } from "@/interfaces/controllers/quotes.controller";
import { TokensController } from "@/interfaces/controllers/tokens.controller";

import { ApplicationModule } from "./application.module";

@Module({
  imports: [ApplicationModule],
  controllers: [FeesController, QuotesController, TokensController]
})
export class HttpModule {}
