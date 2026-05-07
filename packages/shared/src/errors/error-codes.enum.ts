export const ErrorCode = {
  // ── Genéricos ──────────────────────────────────────────────────────────────
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // ── Database ───────────────────────────────────────────────────────────────
  DB_UNIQUE_VIOLATION: 'DB_UNIQUE_VIOLATION',
  DB_FOREIGN_KEY_VIOLATION: 'DB_FOREIGN_KEY_VIOLATION',
  DB_VALIDATION_ERROR: 'DB_VALIDATION_ERROR',
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_TIMEOUT: 'DB_TIMEOUT',
  DB_UNKNOWN_ERROR: 'DB_UNKNOWN_ERROR',

  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_NOT_SAME_PASSWORD: 'AUTH_NOT_SAME_PASSWORD',
  AUTH_INVALID_PASSWORD: 'AUTH_INVALID_PASSWORD',
  AUTH_NOT_FOUND: 'AUTH_NOT_FOUND',

  // ── Availability ───────────────────────────────────────────────────────────
  AVAIL_OVERLAP: 'AVAIL_OVERLAP',
  AVAIL_NOT_FOUND: 'AVAIL_NOT_FOUND',

  // ── Barber / Barbershop ────────────────────────────────────────────────────
  BARBER_NOT_FOUND: 'BARBER_NOT_FOUND',
  BARBERSHOP_NOT_FOUND: 'BARBERSHOP_NOT_FOUND',

  // ── Appointments (lógica frontend) ─────────────────────────────────────────
  APPT_BLOCK_OVERLAP_BLOCK: 'APPT_BLOCK_OVERLAP_BLOCK',
  APPT_BLOCK_OVERLAP_APPT: 'APPT_BLOCK_OVERLAP_APPT',

  // ── Offers ───────────────────────────────────────────────────────────────────
  OFFER_CREATION_FAILED: 'OFFER_CREATION_FAILED',
  OFFER_NOT_FOUND: 'OFFER_NOT_FOUND',
  OFFER_OVERLAP: 'OFFER_OVERLAP',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
