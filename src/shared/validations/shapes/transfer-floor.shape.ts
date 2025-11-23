import * as v from "valibot";
import { formatUnits } from "viem";

import { FEE_REGISTORY } from "@/registries/fee.registry";
import { ChainByToken, SUPPORT_CHAIN_TO_TOKEN, Token, TOKEN_REGISTRY } from "@/registries/token-chain.registry";

import { stringBigintValidator } from "../rules/string-bigint.validator";

const buildTransferFloorShape = <T extends Token, K extends ChainByToken<T>>(token: T, chain: K) =>
  v.pipe(
    v.object(
      {
        chain: v.literal(chain),
        token: v.object({
          symbol: v.literal(token)
        }),
        feeToken: v.object(
          {
            symbol: v.picklist(
              SUPPORT_CHAIN_TO_TOKEN[chain],
              `When chain is ${chain}, feeToken.symbol must be one of: ${SUPPORT_CHAIN_TO_TOKEN[chain].join(", ")}.`
            )
          },
          `feeToken must be an object. Required fields: symbol`
        ),
        amountMinUnits: stringBigintValidator("amountMinUnits")
      },
      issue => `${issue.expected} is required`
    ),
    v.forward(
      v.check(
        dto => BigInt(dto.amountMinUnits) >= FEE_REGISTORY[chain][token].minTransferAmountUnits,
        issue => {
          const dto = issue.input;
          const minUnits = FEE_REGISTORY[chain][token].minTransferAmountUnits;
          const displayValue = formatUnits(minUnits, TOKEN_REGISTRY[token].decimals);
          return `Minimum transferable amount for ${dto.token.symbol} is ${displayValue} ${dto.token.symbol} (${minUnits.toString()} minimal units).`;
        }
      ),
      ["amountMinUnits"]
    )
  );

const TokenToTransferFloorShapeMap = {
  JPYC: {
    mainnet: buildTransferFloorShape("JPYC", "mainnet"),
    polygon: buildTransferFloorShape("JPYC", "polygon"),
    sepolia: buildTransferFloorShape("JPYC", "sepolia"),
    polygonAmoy: buildTransferFloorShape("JPYC", "polygonAmoy")
  },
  USDC: {
    mainnet: buildTransferFloorShape("USDC", "mainnet"),
    base: buildTransferFloorShape("USDC", "base"),
    polygon: buildTransferFloorShape("USDC", "polygon"),
    sepolia: buildTransferFloorShape("USDC", "sepolia"),
    baseSepolia: buildTransferFloorShape("USDC", "baseSepolia"),
    polygonAmoy: buildTransferFloorShape("USDC", "polygonAmoy")
  },
  EURC: {
    mainnet: buildTransferFloorShape("EURC", "mainnet"),
    base: buildTransferFloorShape("EURC", "base"),
    sepolia: buildTransferFloorShape("EURC", "sepolia"),
    baseSepolia: buildTransferFloorShape("EURC", "baseSepolia")
  }
} as const satisfies { [T in Token]: Record<ChainByToken<T>, unknown> };

export const TokenTransferFloorShape = {
  JPYC: v.variant("chain", Object.values(TokenToTransferFloorShapeMap.JPYC)),
  USDC: v.variant("chain", Object.values(TokenToTransferFloorShapeMap.USDC)),
  EURC: v.variant("chain", Object.values(TokenToTransferFloorShapeMap.EURC))
} as const satisfies Record<Token, unknown>;
