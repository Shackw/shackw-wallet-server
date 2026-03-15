import { Module } from "@nestjs/common";

import { AppCheckGuard } from "@/interfaces/common/guards/app-check.guard";
import { FeesController } from "@/interfaces/features/fees";
import { MetaController } from "@/interfaces/features/meta";
import { QuotesController } from "@/interfaces/features/quotes";
import { TokensController } from "@/interfaces/features/tokens";
import { TransactionsController } from "@/interfaces/features/transactions";

import { ApplicationModule } from "./application.module";

@Module({
  imports: [ApplicationModule],
  controllers: [FeesController, QuotesController, TokensController, TransactionsController, MetaController],
  providers: [AppCheckGuard]
})
export class HttpModule {}
