import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Ocurrió un error inesperado en el servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Extract code and message, especially handling class-validator errors
      if (typeof exceptionResponse === 'object') {
        message = Array.isArray(exceptionResponse.message) 
          ? exceptionResponse.message[0] // Get first validation error message
          : exceptionResponse.message || exception.message;
        
        code = exceptionResponse.error 
          ? exceptionResponse.error.toUpperCase().replace(/\s+/g, '_') 
          : 'HTTP_EXCEPTION';
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
            message = 'Ocurrio un error inesperado en el servidor';
            console.log(exception)
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }
}
