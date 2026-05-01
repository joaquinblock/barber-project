import { format, parseISO, parse, addMinutes, isBefore  } from 'date-fns';
import { es } from 'date-fns/locale';
import type  { DayKey, ErrorCode, TimeRange, DateKey, ApptsByDay, Appt} from '@/shared/types';
import type { HourString } from "@/shared/types";
/**
 * FORMATEO: De Objeto/ISO a Key de búsqueda (yyyy-MM-dd)
 */
export const formatDateToKey = (date: Date | DateKey): DateKey => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd') as DateKey;
};

/**
 * Convierte "2026-03-21" -> "S" (DayKey)
 * 
 * Es para buscar el dia "L" en el JSON de Availability a partir de una fecha. 
 */
// export const formatDateToDayKey = (dateStr: DateKey): DayKey => {
//   // Separamos la fecha para evitar problemas de zona horaria
//   const [year, month, day] = dateStr.split("-").map(Number);
//   const date = new Date(year, month - 1, day);
  
//   // Mapa de días que machea con tus constantes de Disponibilidad
//   const map: DayKey[] = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
//   return map[date.getDay()];
// };


/**
 * DISPLAY: De Objeto/ISO a "Lunes, 17 de Marzo"
 */
export const formatDateToDisplay = (date: Date | DateKey): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "EEEE, d 'de' MMMM", { locale: es });
};


/**
 * VALIDACIÓN UI: ¿Es coherente el rango?
 */
export const validateBasicTimeRange = (range: TimeRange): ErrorCode | null => {
  if (!range.startTime || !range.endTime) return 'REQUIRED_FIELDS';
  if (range.startTime >= range.endTime) return 'INVALID_RANGE';
  return null;
};

/**
 * LÓGICA DE NEGOCIO: ¿Hay choque entre rangos?
 */
export const findConflict = <T extends TimeRange>(
  newRange: TimeRange,
  existingItems: T[]
): T | undefined => {
  return existingItems.find((item) => {
    return (
      newRange.startTime < item.endTime && 
      item.startTime < newRange.endTime
    );
  });
};

/**
 * Genera todos los slots de tiempo posibles para un conjunto de intervalos.
 * Ejemplo: intervalo 09:00–18:00 con slots de 30min → ["09:00", "09:30", ..., "17:30"]
 */
export function generateTimeSlots(
  intervals: TimeRange[],
  slotSizeMinutes: number = 30
): HourString[] {
  const slots: HourString[] = [];

  for (const { startTime, endTime } of intervals) {
    let current = parse(startTime, "HH:mm", new Date());
    const end = parse(endTime, "HH:mm", new Date());

    while (isBefore(current, end)) {
      slots.push(format(current, "HH:mm") as HourString);
      current = addMinutes(current, slotSizeMinutes);
    }
  }

  return slots;
}


/// Agrupa los turnos por día para facilitar en BookingTime, donde se necesitan los turnos filtrados por día.
export function groupApptsByDay(appts: Appt[]): ApptsByDay {
  return appts.reduce<ApptsByDay>((map, appt) => {
    const existing = map.get(appt.date) ?? [];
    map.set(appt.date, [...existing, appt]);
    return map;
  }, new Map());
}


/**
 * Convierte un string "HH:mm" a minutos totales desde el inicio del día.
 * Ej: "09:30" -> 570
 */
export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Verifica si un slot de tiempo colisiona con algún turno existente.
 */
export const isSlotOccupied = (
  slot: string, 
  appointments: any[], 
  slotDurationMinutes: number = 30
): boolean => {
  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + slotDurationMinutes;

  return appointments.some((appt) => {
    const apptStart = timeToMinutes(appt.startTime);
    const apptEnd = timeToMinutes(appt.endTime);

    // Lógica de solapamiento de intervalos
    return (
      (slotStart >= apptStart && slotStart < apptEnd) || // El inicio del slot cae dentro del turno
      (slotEnd > apptStart && slotEnd <= apptEnd) ||    // El fin del slot cae dentro del turno
      (apptStart >= slotStart && apptStart < slotEnd)    // El turno empieza dentro del slot
    );
  });
};