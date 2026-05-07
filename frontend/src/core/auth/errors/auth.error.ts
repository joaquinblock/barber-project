import { ApiError } from '@barber/shared/errors';
import type { ErrorCode } from '@barber/shared/errors';

export class AuthError extends ApiError {
  constructor(code: ErrorCode, message?: string) {
    super(code, message ?? code);
    this.name = 'AuthError';
  }
}
