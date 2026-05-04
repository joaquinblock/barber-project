import type { DayKey } from "./time.types";

export type AvailabilityDTO = {
  dayOfWeek: DayKey;
  startTime: string;
  endTime: string;
  barberId: string;
  barbershopId: string;
};

export type AvailabilityResponseDTO = AvailabilityDTO & {
  id: string;
};