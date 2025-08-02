import { Body, Controller, Logger, Post, UseFilters } from "@nestjs/common";

import { RpcRequestDto } from "../dtos/rpc-request.dto";
import { RpcExceptionsFilter } from "../libs/rpc-exception.filter";
import { SendUserOperationService } from "../services/send-user-operation.service";
import { JsonRpcResponse } from "../types/rpc-response.type";
import { makeSuccessResponse } from "../utils/rpc-response.util";

@Controller("rpc/v1")
@UseFilters(RpcExceptionsFilter)
export class RpcController {
  @Post("/")
  async handler<T = any>(@Body() rpcRequestDto: RpcRequestDto): Promise<JsonRpcResponse<T>> {
    const { method, id } = rpcRequestDto;

    Logger.debug(rpcRequestDto);

    switch (method) {
      case "eth_sendUserOperation": {
        const sendUserOperation = new SendUserOperationService();

        const result = await sendUserOperation.send();
        return makeSuccessResponse(id, result as T);
      }
    }
  }
}
