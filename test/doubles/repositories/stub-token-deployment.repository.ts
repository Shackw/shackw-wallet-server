import type {
  ChainMasterContract,
  FindChainMasterQuery,
  FindTokenDeploymentQuery,
  FindTokenMasterByAddressQuery,
  TokenDeploymentContract,
  TokenDeploymentRepository,
  TokenMasterContract
} from "@/application/ports/repositories/token-deployment.repository.port";
import { CHAIN_KEY_TO_VIEM_CHAIN } from "@/config/chain.config";

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
      rpcUrl: "",
      viem: CHAIN_KEY_TO_VIEM_CHAIN[query.chainKey],
      contracts: {
        delegate: "0x",
        registry: "0x"
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
