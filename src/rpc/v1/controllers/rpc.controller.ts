import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import * as v from "valibot";

import { RpcExceptionsFilter } from "../libs/rpc-exception.filter";
import { RpcSchema } from "../schema/rpc.schema";
import { GetPaymasterAndDataService } from "../services/get-paymaster-and-data.service";
import { SendUserOperationService } from "../services/send-user-operation.service";
import { makeSuccessResponse } from "../utils/rpc-response.util";

@Controller("rpc/v1")
@UseFilters(RpcExceptionsFilter)
export class RpcController {
  constructor(
    private readonly sendUserOperation: SendUserOperationService,
    private readonly getPaymasterAndDataService: GetPaymasterAndDataService
  ) {}

  @Post()
  @HttpCode(200)
  async handler(@Body() body: unknown) {
    const req = v.parse(RpcSchema, body);
    const { id, method } = req;

    let result: unknown;

    switch (method) {
      case "eth_sendUserOperation": {
        result = await this.sendUserOperation.send();
        break;
      }
      case "pm_preparePaymasterAndData": {
        result = await this.getPaymasterAndDataService.get();
        break;
      }
    }

    return makeSuccessResponse<typeof result>(id, result);
  }
}
