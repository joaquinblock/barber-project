import { ERROR_MESSAGES } from "@/shared/constants/error.messages";
import type { ApptErrorCode } from "../types";

export const APPT_ERROR_MESSAGES: Record<ApptErrorCode, string> = {
    // --- Globales 
    ...ERROR_MESSAGES,
    
    // --- Específicos de Negocio ---
    BLOCK_OVERLAP_BLOCK: "El horario ya está marcado como bloqueado.",
    BLOCK_OVERLAP_APPT: "El bloqueo coincide con un turno agendado.",
};