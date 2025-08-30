import { Module } from "@nestjs/common";

import { FeesController } from "./controllers/fees.controller";
import { repositoriesProviders } from "./providers/repositories.provider";
import { FeesService } from "./services/fees.service";

@Module({
  controllers: [FeesController],
  providers: [...repositoriesProviders, FeesService]
})
export class ApiV1Module {}
