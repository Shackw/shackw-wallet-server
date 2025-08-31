import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import * as v from "valibot";

@Injectable()
export class ValibotPipe<S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
  implements PipeTransform<unknown, v.InferOutput<S>>
{
  constructor(private readonly schema: S) {}

  transform(value: unknown) {
    const r = v.safeParse(this.schema, value);
    if (r.success) return r.output;

    const messages = r.issues.map(i => `${i.message}`.trim().replace(/"([A-Za-z0-9_.[\]-]+)"/g, "$1"));
    throw new BadRequestException(messages);
  }
}
