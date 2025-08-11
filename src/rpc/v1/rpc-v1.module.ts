import { Module } from "@nestjs/common";

import { tokenSymbols } from "./common/di.tokens";
import { RpcController } from "./controllers/rpc.controller";
import { registriesProviders } from "./providers/registries.provider";
import { repositoriesProviders } from "./providers/repositories.provider";
import { UserOperationService } from "./services/user-operation.service";

@Module({
  controllers: [RpcController],
  providers: [...registriesProviders, ...repositoriesProviders, UserOperationService],
  exports: [...tokenSymbols]
})
export class RpcV1Module {}
