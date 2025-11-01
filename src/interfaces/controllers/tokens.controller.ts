import { Controller, UseFilters, Post, UsePipes, Body } from "@nestjs/common";

import { TokenService } from "@/application/services/token.service";
import { TransferTokenModel } from "@/domain/entities/token.model";

import { TransferTokenDtoSchema, TransferTokenDto } from "../dto/token.dto";
import { HttpExceptionsFilter } from "../filters/http-exception.filter";
import { ValibotPipe } from "../pipes/valibot.pipe";

@Controller()
@UseFilters(HttpExceptionsFilter)
export class TokensController {
  constructor(private tokenService: TokenService) {}

  @Post("tokens\\:transfer")
  @UsePipes(new ValibotPipe(TransferTokenDtoSchema))
  async estimate(@Body() body: TransferTokenDto): Promise<TransferTokenModel> {
    const result = await this.tokenService.transferToken(body);
    return result;
  }
}
