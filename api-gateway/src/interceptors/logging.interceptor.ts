import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = request;
    
    // Log request
    this.logger.debug(JSON.stringify({
      type: 'REQUEST',
      method,
      url,
      body,
      params,
      query,
      timestamp: new Date().toISOString()
    }));

    return next.handle().pipe(
      tap((response) => {
        // Log successful response
        this.logger.log(JSON.stringify({
          type: 'RESPONSE_SUCCESS',
          method,
          url,
          success: response?.success || true,
          timestamp: new Date().toISOString()
        }));
      }),
      catchError((error) => {
        // Log error response
        this.logger.error(JSON.stringify({
          type: 'RESPONSE_ERROR',
          method,
          url,
          error: error.message || error,
          timestamp: new Date().toISOString()
        }));
        return throwError(() => error);
      })
    );
  }
}