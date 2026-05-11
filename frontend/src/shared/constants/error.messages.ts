import { ErrorCode } from '@barber/shared/errors';

export const ERROR_MESSAGES: Partial<Record<ErrorCode, string>> = {
  // ── Genéricos ──────────────────────────────────────────────────────────────
  [ErrorCode.UNKNOWN_ERROR]: 'Ocurrió un error inesperado.',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Has realizado demasiadas peticiones. Intenta más tarde.',

  //── Errores del cliente (4xx) ───────────────────────────────────────────────
  [ErrorCode.BAD_REQUEST]: 'Solicitud inválida.', //400
  [ErrorCode.UNAUTHORIZED]: 'No estás autenticado.', //401
  [ErrorCode.FORBIDDEN]: 'No tenés permiso para realizar esta acción.', //403
  [ErrorCode.NOT_FOUND]: 'Recurso no encontrado.', //404 
  [ErrorCode.CONFLICT]: 'El recurso ya existe.', //409

  //── Errores del servidor (5xx) ───────────────────────────────────────────────
  [ErrorCode.SERVER_ERROR]: 'Error de conexión. Intente nuevamente.', //500
  [ErrorCode.BAD_GATEWAY]: 'Error en la puerta de enlace.', //502
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Servicio no disponible.', //503
  [ErrorCode.GATEWAY_TIMEOUT]: 'Error en la puerta de enlace.', //504

  // ── Database ───────────────────────────────────────────────────────────────
  [ErrorCode.DB_UNIQUE_VIOLATION]: 'Ya existe un registro con esos datos.',
  [ErrorCode.DB_FOREIGN_KEY_VIOLATION]: 'Uno de los recursos relacionados no existe.',
  [ErrorCode.DB_VALIDATION_ERROR]: 'Los datos enviados no cumplen con las reglas de validación.',
  [ErrorCode.DB_CONNECTION_ERROR]: 'No se pudo establecer conexión con la base de datos.',
  [ErrorCode.DB_TIMEOUT]: 'La operación en la base de datos tardó demasiado. Intenta nuevamente.',
  [ErrorCode.DB_UNKNOWN_ERROR]: 'Error inesperado en el servidor de base de datos.',

  // ── Auth ───────────────────────────────────────────────────────────────────
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'El correo o la contraseña son incorrectos.',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'No se encontró una cuenta con ese correo electrónico.',
  [ErrorCode.AUTH_FORBIDDEN]: 'No tenés permiso para realizar esta acción.',
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
  [ErrorCode.OFFER_INVALID_TITLE]: 'El título debe tener entre 3 y 100 caracteres y no puede ser solo números.',
  [ErrorCode.OFFER_INVALID_PRICE]: 'El precio debe ser un número válido y no puede ser negativo.',
  [ErrorCode.OFFER_INVALID_DURATION]: 'La duración debe ser al menos 1 minuto.',

  // ── Exceptions ───────────────────────────────────────────────────────────
  [ErrorCode.EXCEPTION_CREATION_FAILED]: 'Error al crear la excepción.',
  [ErrorCode.EXCEPTION_NOT_FOUND]: 'Excepción no encontrada.',
  [ErrorCode.EXCEPTION_OVERLAP]: 'La excepción se superpone con una excepción existente.',
  [ErrorCode.EXCEPTION_INVALID_DATE]: 'La fecha de la excepción es inválida.',
};