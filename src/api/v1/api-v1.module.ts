import { Module } from "@nestjs/common";

import { FeesController } from "./controllers/fees.controller";
import { QuotesController } from "./controllers/quotes.controller";
import { TokensController } from "./controllers/tokens.controller";
import { repositoriesProviders } from "./providers/repositories.provider";
import { FeesService } from "./services/fees.service";
import { QuotesService } from "./services/quotes.service";
import { TokenService } from "./services/token.service";

@Module({
  controllers: [FeesController, QuotesController, TokensController],
  providers: [...repositoriesProviders, FeesService, QuotesService, TokenService]
})
export class ApiV1Module {}
