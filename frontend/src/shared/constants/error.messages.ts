import type { ErrorCode } from "@/shared/types";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_RANGE: "La hora de inicio debe ser anterior a la hora de fin.",
  REQUIRED_FIELDS: "Complete todos los campos obligatorios.",
  SERVER_ERROR: "Error de conexión. Intente nuevamente.",
  BARBER_NOT_FOUND: "No se encontro el barbero solicitado.",
  BARBERSHOP_NOT_FOUND: "No se encontro la barberia solicitada.",
  INVALID_TIME_FORMAT: "El formato de hora es invalido. Usa HH:mm.",
};