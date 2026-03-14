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
  findTokenMasterByAddress(_query: FindTokenMasterByAddressQuery): TokenMasterContract | null {
    return null;
  }

  listChainMasters(): ChainMasterContract[] {
    return [];
  }

  findChainMaster(query: FindChainMasterQuery): ChainMasterContract {
    return {
      key: query.chainKey,
      id: CHAIN_KEY_TO_VIEM_CHAIN[query.chainKey].id,
      rpcUrl: "https://test-rpc.com",
      viem: CHAIN_KEY_TO_VIEM_CHAIN[query.chainKey],
      contracts: {
        sponsor: "0xSponsor",
        delegate: "0xDelegate",
        registry: "0xRegistry"
      }
    };
  }

  listTokenDeployment(): TokenDeploymentContract[] {
    return [];
  }

  findTokenDeployment(_query: FindTokenDeploymentQuery): TokenDeploymentContract | null {
    return null;
  }
}
