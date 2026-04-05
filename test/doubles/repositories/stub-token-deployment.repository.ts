import type {
  ChainMasterContract,
  FindChainMasterQuery,
  FindTokenDeploymentQuery,
  FindTokenMasterByAddressQuery,
  TokenDeploymentContract,
  TokenDeploymentRepository,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/domain/constants/chain.constant";

export class StubTokenDeploymentRepository implements TokenDeploymentRepository {
  findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): Promise<TokenMasterContract | null> {
    return Promise.resolve(null);
  }

  listChainMasters(): Promise<ChainMasterContract[]> {
    return Promise.resolve([]);
  }

  findChainMaster(query: FindChainMasterQuery): Promise<ChainMasterContract> {
    return Promise.resolve({
      key: query.chainKey,
      id: CHAIN_KEY_TO_VIEM_CHAIN[query.chainKey].id,
      rpcUrl: "https://test-rpc.com",
      viem: CHAIN_KEY_TO_VIEM_CHAIN[query.chainKey],
      contracts: {
        sponsor: "0xSponsor",
        delegate: "0xDelegate",
        registry: "0xRegistry"
      }
    });
  }

  listTokenDeployment(): Promise<TokenDeploymentContract[]> {
    return Promise.resolve([]);
  }

  findTokenDeployment(_query: FindTokenDeploymentQuery): Promise<TokenDeploymentContract | null> {
    return Promise.resolve(null);
  }
}
