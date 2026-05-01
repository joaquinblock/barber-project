import type { ErrorCode } from "@/shared/types";

export type AuthSpecificErrorCode = 
  | 'AUTH_INVALID_CREDENTIALS' 
  | 'AUTH_USER_NOT_FOUND' 
  | 'AUTH_NETWORK_ERROR'
  | 'AUTH_SESSION_EXPIRED';

export type AuthErrorCode = AuthSpecificErrorCode | ErrorCode;