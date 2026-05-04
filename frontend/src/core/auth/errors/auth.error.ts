import { HttpError } from "@/shared/errors";
import type { AuthErrorCode } from "../types";

export class AuthError extends HttpError {
  public readonly code: AuthErrorCode;

  constructor(status: number, code: AuthErrorCode, message?: string) {
    super(status, message || code);
    this.name = 'AuthError';
    this.code = code;
  }
}
