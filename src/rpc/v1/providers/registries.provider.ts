import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Chain, Hex, PublicClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { PaymasterKind } from "../models/userOperation";
import { PAYMASTER_REGISTRY, SIGNER_REGISTRY, VIEM_CHAIN, VIEM_PUBLIC_CLIENT } from "../tokens";

export interface PaymasterInfo {
  address: Hex;
}

export interface PaymasterRegistry {
  get(kind: PaymasterKind): PaymasterInfo;
}

export interface SignerRegistry {
  get(kind: PaymasterKind): { signMessage: (m: { raw: Hex }) => Promise<Hex> };
}

export const registriesProviders: Provider[] = [
  {
    provide: VIEM_CHAIN,
    useFactory: (cfg: ConfigService) =>
      ({
        id: cfg.get<number>("CHAIN_ID", { infer: true }) as number,
        name: cfg.get<string>("CHAIN_NAME", { infer: true }) as string,
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: [cfg.get<string>("RPC_PROVIDER", { infer: true }) as string] } }
      }) satisfies Chain,
    inject: [ConfigService]
  },
  {
    provide: VIEM_PUBLIC_CLIENT,
    useFactory: (chain: Chain): PublicClient =>
      createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0])
      }) as unknown as PublicClient,
    inject: [VIEM_CHAIN]
  },
  {
    provide: PAYMASTER_REGISTRY,
    useFactory: (cfg: ConfigService): PaymasterRegistry => {
      const map: Record<PaymasterKind, PaymasterInfo> = {
        JPYS: {
          address: cfg.get<string>("JPYS_PAYMASTER_ADDRESS", { infer: true }) as Hex
        },
        USDC: {
          address: cfg.get<string>("USDC_PAYMASTER_ADDRESS", { infer: true }) as Hex
        },
        EURC: {
          address: cfg.get<string>("EURC_PAYMASTER_ADDRESS", { infer: true }) as Hex
        }
      };

      return {
        get(kind) {
          return map[kind];
        }
      };
    },
    inject: [ConfigService]
  },
  {
    provide: SIGNER_REGISTRY,
    useFactory: (cfg: ConfigService): SignerRegistry => {
      const accounts = {
        JPYS: privateKeyToAccount(cfg.get<string>("JPYC_SIGNER_PK", { infer: true }) as Hex),
        USDC: privateKeyToAccount(cfg.get<string>("USDC_SIGNER_PK", { infer: true }) as Hex),
        EURC: privateKeyToAccount(cfg.get<string>("EURC_SIGNER_PK", { infer: true }) as Hex)
      } as const;

      return {
        get(kind) {
          const acc = accounts[kind];
          return {
            signMessage: (m: { raw: Hex }) => acc.signMessage({ message: m })
          };
        }
      };
    },
    inject: [ConfigService]
  }
];
