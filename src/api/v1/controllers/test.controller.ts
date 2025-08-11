import { Controller, Get, UseFilters } from "@nestjs/common";

import { HttpExceptionsFilter } from "../../../common/filters/http-exception.filter";
import { TestService } from "../services/test.service";

@Controller("api/v1/test")
@UseFilters(HttpExceptionsFilter)
export class TestController {
  private testService: TestService;
  constructor() {
    this.testService = new TestService();
  }

  @Get()
  async get(): Promise<string> {
    const result = await this.testService.get();
    return result;
  }
}
