import type { ErrorCode} from "@/shared/types";

export type AvailSpecificErrorCode = 
  | 'WORK_BLOCK_OVERLAP' 
  | 'MAX_INTERVALS_REACHED'
  | 'AVAILABILITY_ALREADY_EXISTS'; // Para evitar duplicados en POST

export type AvailErrorCode = AvailSpecificErrorCode | ErrorCode;

