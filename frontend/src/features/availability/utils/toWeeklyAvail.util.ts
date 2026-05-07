import type { WeeklyAvailability } from "../types";
import type { AvailResponseDTO, DayKey, HourString, TimeRangeResponse } from "@barber/shared/types";

// Un array auxiliar con todos los días para facilitar la inicialización
const ALL_DAYS: DayKey[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const toWeeklyAvail = (
  backendData: AvailResponseDTO[]
): WeeklyAvailability => {
  
  // 1. Inicializamos el registro con todos los días como NonWorkingDay
  const weeklyAvail = {} as WeeklyAvailability;

  for (const day of ALL_DAYS) {
    weeklyAvail[day] = {
      dayKey: day,
      isWorking: false,
    };
  }

  // 2. Iteramos sobre los datos del backend para poblar los intervalos
  for (const dto of backendData) {
    const { dayOfWeek, startTime, endTime, id } = dto;

    // Creamos el objeto de intervalo con el casteo necesario a HourString
    const timeRange: TimeRangeResponse = {
      id,
      startTime: startTime.slice(0, 5) as HourString,
      endTime: endTime.slice(0, 5) as HourString,
    };

    const currentDay = weeklyAvail[dayOfWeek];

    // 3. Verificamos si el día ya fue marcado como laborable
    if (currentDay.isWorking) {
      // Gracias al tipo discriminado (isWorking: true), TS sabe que "intervals" existe aquí
      currentDay.intervals.push(timeRange);
    } else {
      // Si era false, lo sobrescribimos con un WorkingDay y su primer intervalo
      // Esto cumple con tu regla de la tupla: [TimeRangeResponse, ...TimeRangeResponse[]]
      weeklyAvail[dayOfWeek] = {
        dayKey: dayOfWeek,
        isWorking: true,
        intervals: [timeRange],
      };
    }
  }

  return weeklyAvail;
};
  