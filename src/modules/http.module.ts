import { Module } from "@nestjs/common";

import { FeesController } from "@/interfaces/controllers/fees.controller";
import { MetaController } from "@/interfaces/controllers/meta.controller";
import { QuotesController } from "@/interfaces/controllers/quotes.controller";
import { TokensController } from "@/interfaces/controllers/tokens.controller";
import { TransactionsController } from "@/interfaces/controllers/transactions.controller";

import { ApplicationModule } from "./application.module";

@Module({
  imports: [ApplicationModule],
  controllers: [FeesController, QuotesController, TokensController, TransactionsController, MetaController]
})
export class HttpModule {}
