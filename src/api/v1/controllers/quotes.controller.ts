import { Controller, UseFilters, UsePipes } from "@nestjs/common";

import { HttpExceptionsFilter } from "@/shared/filters/http-exception.filter";
import { ValibotPipe } from "@/shared/pipes/valibot.pipe";

@Controller("api/v1/quotes")
@UsePipes(ValibotPipe)
@UseFilters(HttpExceptionsFilter)
export class QuotesController {}
