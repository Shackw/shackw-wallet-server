import * as v from "valibot";

import type { MoralisSearchTransfersQuery } from "@/application/ports/gateways/moralis.gateway.port";
import type { Chain } from "@/config/chain.config";
import { addressValidator, hex32Validator } from "@/shared/validations/rules/address.validator";
import {
  isoDateStringValidator,
  nullableString,
  stringBigintValidator
} from "@/shared/validations/rules/string.validator";

import type { Address } from "viem";

export const APP_CHIAN_TO_MORARIS_CHAIN_MAP = {
  mainnet: "eth",
  base: "base",
  polygon: "polygon",
  sepolia: "sepolia",
  baseSepolia: "base sepolia",
  polygonAmoy: "polygon amoy"
} as const satisfies Record<Chain, string>;

export const APP_SORT_ORDER_TO_MORALIS_SORT_ORDER = {
  asc: "ASC",
  desc: "DESC"
} as const satisfies Record<MoralisSearchTransfersQuery["sortOrder"], "ASC" | "DESC">;

// === Response Schemas ====
export const MoralisSearchTransfersResponseDtoSchema = v.object({
  page: v.number("page must be a number"),
  page_size: v.number("page_size must be a number"),
  cursor: nullableString("cursor"),
  result: v.array(
    v.object({
      token_name: nullableString("result[].token_name"),
      token_symbol: v.string("result[].token_symbol is required"),
      token_logo: nullableString("result[].token_logo"),
      token_decimals: v.string("result[].token_decimals must be a string"),
      from_address_entity: nullableString("result[].from_address_entity"),
      from_address_entity_logo: nullableString("result[].from_address_entity_logo"),
      from_address: addressValidator("result[].from_address"),
      from_address_label: nullableString("result[].from_address_label"),
      to_address_entity: nullableString("result[].to_address_entity"),
      to_address_entity_logo: nullableString("result[].to_address_entity_logo"),
      to_address: addressValidator("result[].to_address"),
      to_address_label: nullableString("result[].to_address_label"),
      address: addressValidator("result[].address"),
      block_hash: v.string("result[].block_hash is required"),
      block_number: stringBigintValidator("result[].block_number"),
      block_timestamp: isoDateStringValidator("result[].block_timestamp"),
      transaction_hash: hex32Validator("result[].transaction_hash"),
      transaction_index: v.number("result[].transaction_index must be a number"),
      log_index: v.number("result[].og_index must be a number"),
      value: stringBigintValidator("result[].value"),
      value_decimal: v.string("result[].value_decimal must be a string"),
      possible_spam: v.boolean("result[].possible_spam must be a boolean"),
      verified_contract: v.boolean("result[].verified_contract must be a boolean"),
      security_score: v.nullable(v.number("result[].security_score must be a number"))
    }),
    "result must be an array"
  )
});

// === Request DTOs ====
export type MoralisSearchTransfersRequestDto = {
  wallet: Address;
  params: {
    chain: (typeof APP_CHIAN_TO_MORARIS_CHAIN_MAP)[keyof typeof APP_CHIAN_TO_MORARIS_CHAIN_MAP];
    from_date: number;
    to_date: number;
    order: (typeof APP_SORT_ORDER_TO_MORALIS_SORT_ORDER)[keyof typeof APP_SORT_ORDER_TO_MORALIS_SORT_ORDER];
    limit: number;
    cursor?: string;
    [key: `contract_addresses${string}`]: string;
  };
};

// === Response DTOs ====
export type MoralisSearchTransfersResponseDto = v.InferOutput<typeof MoralisSearchTransfersResponseDtoSchema>;
