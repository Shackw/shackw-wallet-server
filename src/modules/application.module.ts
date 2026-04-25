import { Module } from "@nestjs/common";

import { DefaultAppCheckPolicy } from "@/application/policies/app-check";
import { DefaultBalanceSufficiencyPolicy } from "@/application/policies/balance-sufficiency";
import { DefaultChainToTokenSupportPolicy } from "@/application/policies/chain-to-token-support";
import { DefaultTransferEligibilityPolicy } from "@/application/policies/transfer-eligibility";
import { FeesService } from "@/application/services/fees";
import { MetaService } from "@/application/services/meta";
import { QuotesService } from "@/application/services/quotes";
import { TokensService } from "@/application/services/tokens";
import { TransactionsService } from "@/application/services/transactions";
import { ENV } from "@/config/env.config";
import { DI_TOKENS } from "@/shared/di.tokens";

import { InfrastructureModule } from "./infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [
    // HMAC secret for QuoteToken signing/verification
    // MEMO: Move config-based DI values to a dedicated ConfigModule once they start to grow.
    {
      provide: DI_TOKENS.QUOTE_TOKEN_SECRET,
      useValue: ENV.QUOTE_TOKEN_SECRET
    },

    // services
    FeesService,
    QuotesService,
    TokensService,
    TransactionsService,
    MetaService,

    // policies
    { provide: DI_TOKENS.APP_CHECK_POLICY, useClass: DefaultAppCheckPolicy },
    { provide: DI_TOKENS.CHAIN_TO_TOKEN_SUPPORT_POLICY, useClass: DefaultChainToTokenSupportPolicy },
    { provide: DI_TOKENS.TRANSFER_ELIGIBILITY_POLICY, useClass: DefaultTransferEligibilityPolicy },
    { provide: DI_TOKENS.BALANCE_SUFFICIENCY_POLICY, useClass: DefaultBalanceSufficiencyPolicy }
  ],
  exports: [
    // services
    FeesService,
    QuotesService,
    TokensService,
    TransactionsService,
    MetaService,

    // policies
    DI_TOKENS.APP_CHECK_POLICY,
    DI_TOKENS.CHAIN_TO_TOKEN_SUPPORT_POLICY,
    DI_TOKENS.TRANSFER_ELIGIBILITY_POLICY,
    DI_TOKENS.BALANCE_SUFFICIENCY_POLICY
  ]
})
export class ApplicationModule {}
