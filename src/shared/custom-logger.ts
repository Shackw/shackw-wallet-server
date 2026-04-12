import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel } from "@nestjs/common";
import dayjs from "dayjs";

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor(options: ConsoleLoggerOptions = {}) {
    super(options);
  }

  protected override printAsJson(
    message: unknown,
    options: {
      context: string;
      logLevel: LogLevel;
      writeStreamType?: "stdout" | "stderr";
      errorStack?: unknown;
    }
  ): void {
    const output = process[options.writeStreamType ?? "stdout"];
    output.write(
      JSON.stringify({
        level: options.logLevel,
        timestamp: dayjs().format(),
        context: options.context,
        message,
        ...(options.errorStack ? { stack: options.errorStack } : {})
      }) + "\n"
    );
  }
}
