import { Module } from "@nestjs/common";

import { BalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import { ChainToTokenSupportPolicy } from "@/application/policies/chain-to-token-support";
import { TransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import { FeesService } from "@/application/services/fees";
import { MetaService } from "@/application/services/meta";
import { QuotesService } from "@/application/services/quotes";
import { TokenService } from "@/application/services/tokens";
import { TransactionsService } from "@/application/services/transactions";
import { ENV } from "@/config/env.config";
import { DI_TOKENS } from "@/shared/tokens/di.tokens";

import { InfrastructureModule } from "./infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [
    // HMAC secret for QuoteToken signing/verification
    {
      provide: DI_TOKENS.QUOTE_TOKEN_SECRET,
      useValue: ENV.QUOTE_TOKEN_SECRET
    },

    // services
    FeesService,
    QuotesService,
    TokenService,
    TransactionsService,
    MetaService,

    // policies
    ChainToTokenSupportPolicy,
    TransferEligibilityPolicy,
    BalanceSufficiencyPolicy
  ],
  exports: [
    // services
    FeesService,
    QuotesService,
    TokenService,
    TransactionsService,
    MetaService,

    // policies
    ChainToTokenSupportPolicy,
    TransferEligibilityPolicy,
    BalanceSufficiencyPolicy
  ]
})
export class ApplicationModule {}
