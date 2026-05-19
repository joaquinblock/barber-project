import type { Day, DayKey, DayName } from "@business/shared/types";

export const DAYS_CONFIG: Record<DayKey, { letter: Day, full: DayName, short: string }> = {
  MON: { letter: 'L', full: 'Lunes', short: 'Lun' },
  TUE: { letter: 'M', full: 'Martes', short: 'Mar' },
  WED: { letter: 'X', full: 'Miércoles', short: 'Mié' },
  THU: { letter: 'J', full: 'Jueves', short: 'Jue' },
  FRI: { letter: 'V', full: 'Viernes', short: 'Vie' },
  SAT: { letter: 'S', full: 'Sábado', short: 'Sáb' },
  SUN: { letter: 'D', full: 'Domingo', short: 'Dom' },
};
