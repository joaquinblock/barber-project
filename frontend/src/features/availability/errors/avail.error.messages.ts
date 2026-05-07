import { ERROR_MESSAGES } from "@/shared/constants/error.messages";
import type { AvailErrorCode } from "../types";

export const AVAIL_ERROR_MESSAGES: Record<AvailErrorCode, string> = {
   ...ERROR_MESSAGES,
    WORK_BLOCK_OVERLAP: "El horario se superpone con un bloque existente.",
    MAX_INTERVALS_REACHED: "Limite de bloques alcanzado para este dia.",
    AVAILABILITY_ALREADY_EXISTS: "Ya existe una disponibilidad para ese horario."
};
  