import type { DateKey } from "./time.types";

export const ExceptionType = {
  FULL_DAY: 'full-day',
  RANGE: 'range'
} as const;

export type ExceptionType = typeof ExceptionType[keyof typeof ExceptionType];

interface ExceptionDTO {
  startDate: DateKey;
  reason: string | null;
}

export interface CreateFullDayDTO extends ExceptionDTO {
  type: typeof ExceptionType.FULL_DAY
}

export interface CreateRangeDTO extends ExceptionDTO {
  type: typeof ExceptionType.RANGE;
  endDate: DateKey;
}
export type CreateExceptionDTO = CreateFullDayDTO | CreateRangeDTO;

export type ExceptionResponseDTO = {
  id: string;
  startDate: string; // YYYY-MM-DD no ponemos DateKey porque es la respuesta del backend
  endDate: string;   // YYYY-MM-DD
  reason: string | null;
  type: ExceptionType;
  professionalId: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
};
