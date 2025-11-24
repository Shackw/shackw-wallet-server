import * as v from "valibot";

import { nullableString } from "../rules/nullable-string";

const MorarisTokenTransferItemSchema = v.object({
  token_name: nullableString("token_name"),
  token_symbol: v.string("token_symbol is required"),
  token_logo: nullableString("token_logo"),
  token_decimals: v.string("token_decimals must be a string"),
  from_address_entity: nullableString("from_address_entity"),
  from_address_entity_logo: nullableString("from_address_entity_logo"),
  from_address: v.string("from_address is required"),
  from_address_label: nullableString("from_address_label"),
  to_address_entity: nullableString("to_address_entity"),
  to_address_entity_logo: nullableString("to_address_entity_logo"),
  to_address: v.string("to_address is required"),
  to_address_label: nullableString("to_address_label"),
  address: v.string("address is required"),
  block_hash: v.string("block_hash is required"),
  block_number: v.string("block_number must be a string"),
  block_timestamp: v.string("block_timestamp must be an ISO date string"),
  transaction_hash: v.string("transaction_hash is required"),
  transaction_index: v.number("transaction_index must be a number"),
  log_index: v.number("log_index must be a number"),
  value: v.string("value must be a string"),
  value_decimal: v.string("value_decimal must be a string"),
  possible_spam: v.boolean("possible_spam must be a boolean"),
  verified_contract: v.boolean("verified_contract must be a boolean"),
  security_score: v.nullable(v.number("security_score must be a number"))
});

export const MorarisTokenTransfersResponseSchema = v.object({
  page: v.number("page must be a number"),
  page_size: v.number("page_size must be a number"),
  cursor: nullableString("cursor"),
  result: v.array(MorarisTokenTransferItemSchema, "result must be an array")
});
