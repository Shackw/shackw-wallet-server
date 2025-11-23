import * as v from "valibot";

const InsightContractEventsPaginationSchema = v.object({
  limit: v.number("result.pagination.limit must be a number"),
  page: v.number("result.pagination.page must be a number"),
  totalCount: v.number("result.pagination.totalCount must be a number")
});

const InsightContractEventDecodedParamsSchema = v.object({
  from: v.string("result.events[].decoded.params.from must be a string"),
  to: v.string("result.events[].decoded.params.to must be a string"),
  value: v.string("result.events[].decoded.params.value must be a string")
});

const InsightContractEventDecodedSchema = v.object({
  name: v.string("result.events[].decoded.name must be a string"),
  signature: v.string("result.events[].decoded.signature must be a string"),
  params: InsightContractEventDecodedParamsSchema
});

const InsightContractEventItemSchema = v.object({
  chainId: v.string("result.events[].chainId must be a string"),
  blockNumber: v.number("result.events[].blockNumber must be a number"),
  blockHash: v.string("result.events[].blockHash must be a string"),
  blockTimestamp: v.number("result.events[].blockTimestamp must be a number"),
  transactionHash: v.string("result.events[].transactionHash must be a string"),
  transactionIndex: v.number("result.events[].transactionIndex must be a number"),
  logIndex: v.number("result.events[].logIndex must be a number"),

  address: v.string("result.events[].address must be a string"),
  data: v.string("result.events[].data must be a string"),
  topics: v.array(v.string(), "result.events[].topics must be an array of strings"),

  decoded: InsightContractEventDecodedSchema
});

export const InsightContractEventsResponseSchema = v.object({
  result: v.object({
    events: v.array(InsightContractEventItemSchema, "result.events must be an array"),
    pagination: InsightContractEventsPaginationSchema
  })
});

export type InsightContractEventsResponse = v.InferOutput<typeof InsightContractEventsResponseSchema>;
