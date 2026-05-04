export type ExceptionType = 'full-day' | 'range';

export type ExceptionDTO = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string | null;
  type: ExceptionType;
  barberId: string;
  barbershopId: string;
};

export type ExceptionResponseDTO = ExceptionDTO & {
  id: string;
};
