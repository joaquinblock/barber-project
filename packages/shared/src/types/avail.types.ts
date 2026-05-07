import type { DayKey } from "./time.types";

export type CreateAvailRequestDTO = {
  dayOfWeek: DayKey;
  startTime: string;
  endTime: string;
};

export type AvailResponseDTO = {
  id: string;
  dayOfWeek: DayKey;
  startTime: string;
  endTime: string;
  barberId: string;  
  barbershopId: string;
  createdAt: string;
  updatedAt: string;
};