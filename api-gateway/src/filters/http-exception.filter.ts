import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exception?.message || 'Unknown error';
    } else if (exception.error) {
      // Log the exception
      console.error(JSON.stringify({
        type: 'HTTP_EXCEPTION',
        error: exception.error,
        stack: exception.stack,
        timestamp: new Date().toISOString()
      }));
      
      // Handle gRPC service errors
      if (typeof exception.error === 'string') {
        if (exception.error.includes('not allowed') || 
            exception.error.includes('required') || 
            exception.error.includes('invalid') ||
            exception.error.includes('validation')) {
          status = HttpStatus.BAD_REQUEST;
        } else if (exception.error.includes('not found')) {
          status = HttpStatus.NOT_FOUND;
        } else if (exception.error.includes('already exists')) {
          status = HttpStatus.CONFLICT;
        }
        message = exception.error;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}