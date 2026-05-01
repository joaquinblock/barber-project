import type { Appt } from "@/shared/types/appt";

/**
 * Genera el texto que verá el usuario para la hora del turno o bloqueo
 */
export const getAppointmentLabel = (item: Appt): string => {
  if (item.type === "blocked") {
    // Para bloqueos, mostramos el rango completo
    return `${item.startTime} - ${item.endTime}`;
  }
  
  // Para turnos (appt), solo la hora de inicio (ej: "13:00")
  return item.startTime;
};