import type { Day, DayKey, DayName } from "@barber/shared/types";

export const DAYS_CONFIG: Record<DayKey, { letter: Day, full: DayName }> = {
  MON: { letter: 'L', full: 'Lunes' },
  TUE: { letter: 'M', full: 'Martes' },
  WED: { letter: 'X', full: 'Miércoles' },
  THU: { letter: 'J', full: 'Jueves' },
  FRI: { letter: 'V', full: 'Viernes' },
  SAT: { letter: 'S', full: 'Sábado' },
  SUN: { letter: 'D', full: 'Domingo' },
};
