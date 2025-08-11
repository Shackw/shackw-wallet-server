import { Provider } from "@nestjs/common";

import { ENTRY_POINT_REPOSITORY, PAYMASTER_REPOSITORY } from "../common/di.tokens";
import { ViemEntryPointRepository } from "../repositories/entryPoint.repository";
import { ViemPaymasterRepository } from "../repositories/paymaster.repository";

export const repositoriesProviders: Provider[] = [
  { provide: ENTRY_POINT_REPOSITORY, useClass: ViemEntryPointRepository },
  { provide: PAYMASTER_REPOSITORY, useClass: ViemPaymasterRepository }
];
