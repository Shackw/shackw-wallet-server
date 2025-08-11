import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import * as v from "valibot";

import { RpcExceptionsFilter } from "../../../common/filters/rpc-exception.filter";
import { makeSuccessResponse } from "../../../common/jsonrpc/response";
import { RpcSchema } from "../schema/rpc.schema";
import { UserOperationService } from "../services/user-operation.service";

@Controller("rpc/v1")
@UseFilters(RpcExceptionsFilter)
export class RpcController {
  constructor(private readonly userOperationService: UserOperationService) {}

  @Post()
  @HttpCode(200)
  async handler(@Body() body: unknown) {
    const req = v.parse(RpcSchema, body);
    const { id, method, params } = req;

    const result = await (async () => {
      switch (method) {
        case "eth_sendUserOperation": {
          return await this.userOperationService.send(params);
        }
        case "pm_preparePaymasterAndData": {
          return await this.userOperationService.prepare(params);
        }
      }
    })();

    return makeSuccessResponse<typeof result>(id, result);
  }
}
