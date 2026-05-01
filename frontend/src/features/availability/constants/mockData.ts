

import type { DayKey } from "@/shared/types";
import type { WeeklyAvailability } from "../types";


export const DAYS_ABBREVIATED: DayKey[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const DAY_NAMES: Record<DayKey, string> = {
    'L': 'Lunes',
    'M': 'Martes',
    'X': 'Miércoles',
    'J': 'Jueves',
    'V': 'Viernes',
    'S': 'Sábado',
    'D': 'Domingo'
};

export const INITIAL_AVAIL: WeeklyAvailability = {
  L: { isWorking: true, intervals: [{ id: 1, startTime: "09:00", endTime: "13:00" }] },
  M: { isWorking: false, intervals: [] },
  X: { isWorking: true, intervals: [{ id: 2, startTime: "09:00", endTime: "18:00" }] },
  J: { isWorking: false, intervals: [] },
  V: { isWorking: false, intervals: [] },
  S: { isWorking: false, intervals: [] },
  D: { isWorking: false, intervals: [] },
};


