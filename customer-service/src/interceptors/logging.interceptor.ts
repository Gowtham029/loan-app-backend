import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('gRPC');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const handler = context.getHandler().name;
    const data = rpcContext.getData();
    const startTime = Date.now();

    this.logger.log(JSON.stringify({
      type: 'gRPC_REQUEST',
      method: handler,
      timestamp: new Date().toISOString(),
      data: this.sanitizeData(data)
    }));

    return next.handle().pipe(
      tap((result) => {
        const responseTime = Date.now() - startTime;
        this.logger.log(JSON.stringify({
          type: 'gRPC_RESPONSE',
          method: handler,
          success: result?.success || false,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }));
      })
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return {};
    const { email, phoneNumber, ...rest } = data;
    return {
      ...rest,
      email: email ? email.substring(0, 3) + '***' : undefined,
      phoneNumber: phoneNumber ? '***' + phoneNumber.slice(-4) : undefined
    };
  }
}