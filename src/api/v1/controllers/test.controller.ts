import { Body, Controller, Post, UseFilters } from "@nestjs/common";

import { HttpExceptionsFilter } from "../../../common/filters/http-exception.filter";
import { TestService } from "../services/test.service";

@Controller("api/v1/test")
@UseFilters(HttpExceptionsFilter)
export class TestController {
  private testService: TestService;
  constructor() {
    this.testService = new TestService();
  }

  @Post()
  async post(@Body() body: unknown): Promise<{
    hash: `0x${string}`;
  }> {
    const result = await this.testService.post(body);
    return result;
  }
}
