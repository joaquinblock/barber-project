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
  professionalId: string;  
  businessId: string;
  createdAt: string;
  updatedAt: string;
};