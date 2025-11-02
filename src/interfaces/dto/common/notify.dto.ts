import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class WebhookDto {
  @ApiProperty({ example: "wh_12345" })
  id!: string;

  @ApiProperty({ example: "https://example.com/api/webhook" })
  url!: string;

  @ApiProperty({ example: "quote_abc123" })
  echo!: string;
}

export class NotifyDto {
  @ApiProperty({
    example: {
      id: "wh_12345",
      url: "https://example.com/api/webhook",
      echo: "quote_abc123"
    }
  })
  @Type(() => WebhookDto)
  webhook!: WebhookDto;
}
