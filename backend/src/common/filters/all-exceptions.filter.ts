import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '@business/shared/errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCode.SERVER_ERROR;
    let message = 'Ocurrió un error inesperado en el servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'object') {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : exceptionResponse.message || exception.message;

        // Si el servicio lanzó con un `code` semántico propio, lo usamos directamente.
        // De lo contrario, generamos uno a partir del tipo de error HTTP.
        code = exceptionResponse.code
          ?? (status === HttpStatus.UNAUTHORIZED ? ErrorCode.UNAUTHORIZED : null)
          ?? (status === HttpStatus.FORBIDDEN ? ErrorCode.FORBIDDEN : null)
          ?? (status === HttpStatus.NOT_FOUND ? ErrorCode.NOT_FOUND : null)
          ?? (status === HttpStatus.CONFLICT ? ErrorCode.CONFLICT : null)
          ?? (status === HttpStatus.BAD_REQUEST ? ErrorCode.BAD_REQUEST : null)
          ?? (exceptionResponse.error
              ? exceptionResponse.error.toUpperCase().replace(/\s+/g, '_')
              : 'HTTP_EXCEPTION');
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      console.error(exception);
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
