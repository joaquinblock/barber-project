import type { DayKey } from "../types";

export const DAYS_CONFIG: Record<DayKey, { letter: string, short: string, full: string }> = {
  MON: { letter: 'L', short: 'Lun', full: 'Lunes' },
  TUE: { letter: 'M', short: 'Mar', full: 'Martes' },
  WED: { letter: 'X', short: 'Mié', full: 'Miércoles' },
  THU: { letter: 'J', short: 'Jue', full: 'Jueves' },
  FRI: { letter: 'V', short: 'Vie', full: 'Viernes' },
  SAT: { letter: 'S', short: 'Sáb', full: 'Sábado' },
  SUN: { letter: 'D', short: 'Dom', full: 'Domingo' },
};