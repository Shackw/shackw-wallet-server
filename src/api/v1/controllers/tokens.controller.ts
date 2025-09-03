import { Body, Controller, Post, UseFilters, UsePipes } from "@nestjs/common";

import { HttpExceptionsFilter } from "@/shared/filters/http-exception.filter";
import { ValibotPipe } from "@/shared/pipes/valibot.pipe";

import { TransferTokenDtoSchema, TransferTokenDto } from "../dtos/token.dto";
import { TokenService } from "../services/token.service";

@Controller("api/v1")
@UseFilters(HttpExceptionsFilter)
export class TokensController {
  constructor(private tokenService: TokenService) {}

  @Post("tokens\\:transfer")
  @UsePipes(new ValibotPipe(TransferTokenDtoSchema))
  async estimate(@Body() body: TransferTokenDto) {
    const result = await this.tokenService.transferToken(body);
    return result;
  }
}
