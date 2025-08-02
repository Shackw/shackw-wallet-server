import { Type } from "class-transformer";
import { IsArray, IsInt, IsDefined, Equals, IsIn } from "class-validator";

import { RpcMethod, RpcMethods } from "../types/rpc-method.type";

export class RpcRequestDto {
  @IsIn(RpcMethods)
  @IsDefined()
  method: RpcMethod;

  @IsArray()
  @Type(() => Object)
  params: any[];

  @IsInt()
  @IsDefined()
  id: number;

  @Equals("2.0", { message: "jsonrpc must be exactly 2.0" })
  jsonrpc: "2.0";
}
