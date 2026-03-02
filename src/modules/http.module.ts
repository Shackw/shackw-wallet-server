import { Module } from "@nestjs/common";

import { FeesController } from "@/interfaces/features/fees";
import { MetaController } from "@/interfaces/features/meta";
import { QuotesController } from "@/interfaces/features/quotes";
import { TokensController } from "@/interfaces/features/tokens";
import { TransactionsController } from "@/interfaces/features/transactions";

import { AppCheckModule } from "./app-check.module";
import { ApplicationModule } from "./application.module";

@Module({
  imports: [ApplicationModule, AppCheckModule],
  controllers: [FeesController, QuotesController, TokensController, TransactionsController, MetaController]
})
export class HttpModule {}
