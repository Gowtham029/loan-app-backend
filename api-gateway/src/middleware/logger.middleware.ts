import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    this.logger.log(JSON.stringify({
      type: 'HTTP_REQUEST',
      method,
      url: originalUrl,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    }));

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(JSON.stringify({
        type: 'HTTP_RESPONSE',
        method,
        url: originalUrl,
        statusCode,
        contentLength,
        responseTime: `${responseTime}ms`,
        ip,
        timestamp: new Date().toISOString()
      }));
    });

    next();
  }
}