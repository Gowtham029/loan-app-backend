import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();
    const methodName = context.getHandler().name;
    
    // Log request
    this.logger.debug(JSON.stringify({
      type: 'GRPC_REQUEST',
      method: methodName,
      data,
      timestamp: new Date().toISOString()
    }));

    return next.handle().pipe(
      tap((response) => {
        // Log successful response
        this.logger.log(JSON.stringify({
          type: 'GRPC_RESPONSE_SUCCESS',
          method: methodName,
          success: response?.success || true,
          timestamp: new Date().toISOString()
        }));
      }),
      catchError((error) => {
        // Log error response
        this.logger.error(JSON.stringify({
          type: 'GRPC_RESPONSE_ERROR',
          method: methodName,
          error: error.message || error,
          timestamp: new Date().toISOString()
        }));
        return throwError(() => error);
      })
    );
  }
}