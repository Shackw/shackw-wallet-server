import * as v from "valibot";

import { addressValidator, hex32Validator } from "@/shared/validations/rules/address.validator";
import { numberBigintValidator, unixTimestampSecondsValidator } from "@/shared/validations/rules/number.validator";
import { stringBigintValidator } from "@/shared/validations/rules/string.validator";

import type { Address } from "viem";

// === Response Schemas ====
export const ThirdwebSearchContractEventsResponseExternalSchema = v.object({
  result: v.object({
    events: v.array(
      v.object({
        chainId: v.string("result.events[].chainId must be a string"),
        blockNumber: numberBigintValidator("result.events[].blockNumber"),
        blockHash: v.string("result.events[].blockHash must be a string"),
        blockTimestamp: unixTimestampSecondsValidator("result.events[].blockTimestamp"),
        transactionHash: hex32Validator("result.events[].transactionHash"),
        transactionIndex: v.number("result.events[].transactionIndex must be a number"),
        logIndex: v.number("result.events[].logIndex must be a number"),
        address: addressValidator("result.events[].address"),
        data: v.string("result.events[].data must be a string"),
        topics: v.array(v.string(), "result.events[].topics must be an array of strings"),
        decoded: v.object({
          name: v.string("result.events[].decoded.name must be a string"),
          signature: v.string("result.events[].decoded.signature must be a string"),
          params: v.object({
            from: addressValidator("result.events[].decoded.params.from"),
            to: addressValidator("result.events[].decoded.params.to"),
            value: stringBigintValidator("result.events[].decoded.params.value")
          })
        })
      }),
      "result.events must be an array"
    ),
    pagination: v.object({
      limit: v.number("result.pagination.limit must be a number"),
      page: v.number("result.pagination.page must be a number"),
      totalCount: v.number("result.pagination.totalCount must be a number")
    })
  })
});

// === Request Externals ====
export type ThirdwebSearchContractEventsRequestExternal = {
  chainId: number;
  tokenAddress: Address;
  params: {
    filterBlockTimestampGte: number;
    filterBlockTimestampLte: number;
    sortOrder: "asc" | "desc";
    limit: number;
    page: number;
    [key: `filterTopic${string}`]: string;
  };
};

// === Response Externals ====
export type ThirdwebSearchContractEventsResponseExternal = v.InferOutput<
  typeof ThirdwebSearchContractEventsResponseExternalSchema
>;
