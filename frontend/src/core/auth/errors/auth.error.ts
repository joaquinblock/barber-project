import { ApiError } from '@business/shared/errors';
import type { ErrorCode } from '@business/shared/errors';

export class AuthError extends ApiError {
  constructor(code: ErrorCode, message?: string) {
    super(code, message ?? code);
    this.name = 'AuthError';
  }
}
