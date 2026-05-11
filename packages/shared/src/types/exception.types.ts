export type ExceptionType = 'full-day' | 'range';

export type CreateExceptionDTO = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string | null;
  type: ExceptionType;
  barberId: string;
  barbershopId: string;
};

export type ExceptionResponseDTO = CreateExceptionDTO & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
