export const ErrorCode = {
  // ── Genéricos ──────────────────────────────────────────────────────────────
   UNKNOWN_ERROR: 'UNKNOWN_ERROR',
   RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

   //Errores del servidor (5xx)
   SERVER_ERROR: 'SERVER_ERROR', //500 - error interno del servidor
   BAD_GATEWAY: 'BAD_GATEWAY', //502 - error en la puerta de enlace
   SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE', //503 - servicio no disponible
   GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT', //504 - lentitud en la respuesta del servidor
   
   //Errores del cliente (4xx)
   BAD_REQUEST: 'BAD_REQUEST', //400 - peticion invalida 
   UNAUTHORIZED: 'UNAUTHORIZED', //401 - no estas autenticado 
   FORBIDDEN: 'FORBIDDEN', //403 - no tienes permiso para realizar la accion 
   NOT_FOUND: 'NOT_FOUND', //404 - el recurso no existe 
   CONFLICT: 'CONFLICT', //409 - el recurso ya existe 

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
  OFFER_INVALID_TITLE: 'OFFER_INVALID_TITLE',
  OFFER_INVALID_PRICE: 'OFFER_INVALID_PRICE',
  OFFER_INVALID_DURATION: 'OFFER_INVALID_DURATION',

  // ── Exceptions ───────────────────────────────────────────────────────────
  EXCEPTION_CREATION_FAILED: 'EXCEPTION_CREATION_FAILED',
  EXCEPTION_NOT_FOUND: 'EXCEPTION_NOT_FOUND',
  EXCEPTION_OVERLAP: 'EXCEPTION_OVERLAP',
  EXCEPTION_INVALID_DATE: 'EXCEPTION_INVALID_DATE',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
