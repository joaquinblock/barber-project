import { toast } from "sonner";
import { ApiError, HttpError, ErrorCode } from "@business/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";

/**
 * Manejador estándar para errores de mutaciones (POST, PATCH, DELETE).
 * Lanza un toast con el mensaje de error.
 * Los errores 401/SessionExpired son manejados globalmente por el api.wrapper,
 * por lo que aquí nos enfocamos en informar al usuario.
 */
export const handleMutationError = (error: unknown) => {
  if (error instanceof ApiError || error instanceof HttpError) {
    toast.error(error.message);
  } else {
    toast.error(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
  }
};
