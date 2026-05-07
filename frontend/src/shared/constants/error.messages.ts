import { ErrorCode } from '@barber/shared/errors';

export const ERROR_MESSAGES: Partial<Record<ErrorCode, string>> = {
  // ── Genéricos ──────────────────────────────────────────────────────────────
  [ErrorCode.SERVER_ERROR]: 'Error de conexión. Intente nuevamente.',
  [ErrorCode.UNKNOWN_ERROR]: 'Ocurrió un error inesperado.',
  [ErrorCode.BAD_REQUEST]: 'Solicitud inválida.',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Has realizado demasiadas peticiones. Intenta más tarde.',

  // ── Auth ───────────────────────────────────────────────────────────────────
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'El correo o la contraseña son incorrectos.',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'No se encontró una cuenta con ese correo electrónico.',
  [ErrorCode.AUTH_FORBIDDEN]: 'No tenés permiso para acceder a esta barbería.',
  [ErrorCode.AUTH_TOKEN_INVALID]: 'Tu sesión ha expirado. Por favor, ingresá de nuevo.',
  [ErrorCode.AUTH_SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor, ingresá de nuevo.',
  [ErrorCode.AUTH_NOT_SAME_PASSWORD]: 'Las contraseñas no coinciden.',
  [ErrorCode.AUTH_INVALID_PASSWORD]: 'La contraseña es incorrecta.',
  [ErrorCode.AUTH_NOT_FOUND]: 'No se encontró el usuario.',

  // ── Availability ───────────────────────────────────────────────────────────
  [ErrorCode.AVAIL_OVERLAP]: 'El horario se superpone con un bloque existente.',
  [ErrorCode.AVAIL_NOT_FOUND]: 'Disponibilidad no encontrada.',

  // ── Barber / Barbershop ────────────────────────────────────────────────────
  [ErrorCode.BARBER_NOT_FOUND]: 'No se encontró el barbero solicitado.',
  [ErrorCode.BARBERSHOP_NOT_FOUND]: 'No se encontró la barbería solicitada.',

  // ── Appointments ───────────────────────────────────────────────────────────
  [ErrorCode.APPT_BLOCK_OVERLAP_BLOCK]: 'El horario ya está marcado como bloqueado.',
  [ErrorCode.APPT_BLOCK_OVERLAP_APPT]: 'El bloqueo coincide con un turno agendado.',

  // ── Offers ───────────────────────────────────────────────────────────────────
  [ErrorCode.OFFER_CREATION_FAILED]: 'Error al crear la oferta.',
  [ErrorCode.OFFER_NOT_FOUND]: 'Oferta no encontrada.',
  [ErrorCode.OFFER_OVERLAP]: 'La oferta se superpone con una oferta existente.',
};