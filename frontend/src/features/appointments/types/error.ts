import type { ErrorCode } from "@/shared/types";

export type ApptSpecificErrorCode = 'BLOCK_OVERLAP_BLOCK' | 'BLOCK_OVERLAP_APPT';

export type ApptErrorCode = ApptSpecificErrorCode | ErrorCode; // Incluye los errores generales también';