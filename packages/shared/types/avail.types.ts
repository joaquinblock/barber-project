import type { DayKey, TimeRange } from "./time.types";

export type AvailabilityDTO = {
  id: string;
  dayOfWeek: DayKey;
  isWorking: boolean;
  intervals: TimeRange[] | null;
  barberId: string;
  barbershopId: string;
};