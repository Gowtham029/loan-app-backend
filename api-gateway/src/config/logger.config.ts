import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.printf(({ timestamp, level, message, context }) => {
        return JSON.stringify({
          timestamp,
          level,
          context,
          message
        });
      }),
    }),
  ],
});