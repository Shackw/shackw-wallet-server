import { Module } from "@nestjs/common";

import { BalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import { FeesService } from "@/application/services/fees";
import { MetaService } from "@/application/services/meta";
import { QuotesService } from "@/application/services/quotes";
import { TokenService } from "@/application/services/tokens";
import { TransactionsService } from "@/application/services/transactions/transactions";

import { InfrastructureModule } from "./infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [
    FeesService,
    QuotesService,
    TokenService,
    TransactionsService,
    MetaService,
    TransferEligibilityPolicy,
    BalanceSufficiencyPolicy
  ],
  exports: [FeesService, QuotesService, TokenService, TransactionsService, MetaService]
})
export class ApplicationModule {}
