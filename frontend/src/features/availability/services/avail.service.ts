import type { OperationResult} from "@/shared/types";
import type { AvailErrorCode } from "../types";
import type { AvailabilityDTO, TimeRange } from "@barber/shared/types";
import type { Availability, WeeklyAvailability } from "@/shared/types/avail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AVAILABILITY_ENDPOINT = `${API_BASE_URL}/availabilities`;

export const AvailService = {
  /**
   * GET: Obtiene la disponibilidad de un barbero por su ID.
   */
  async getByBarber(
    barberId: string,
    barbershopId: string,
  ): Promise<OperationResult<WeeklyAvailability, AvailErrorCode>> {
    try {
      const response = await fetch(
        `${AVAILABILITY_ENDPOINT}/barbers/${barberId}?barbershopId=${barbershopId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code ?? "SERVER_ERROR",
            message: data.message ?? "Error al obtener disponibilidad",
          },
        };
      }

      const items: any[] = Array.isArray(data) ? data : [data];

      //El mapeo es necesario para transformar la respuesta del backend al formato que espera el frontend, especialmente para manejar los días que no vienen en la respuesta (asumiendo que son no laborables) y para adaptar la estructura de los intervalos.
      const availabilitiesMap: WeeklyAvailability = { //es solo por formato, el backend puede devolver solo los días que tienen disponibilidad configurada, y el frontend asume que los días faltantes son no laborables
        MON: { DayKey: "MON", isWorking: false },
        TUE: { DayKey: "TUE", isWorking: false },
        WED: { DayKey: "WED", isWorking: false },
        THU: { DayKey: "THU", isWorking: false },
        FRI: { DayKey: "FRI", isWorking: false },
        SAT: { DayKey: "SAT", isWorking: false },
        SUN: { DayKey: "SUN", isWorking: false },
      };

      items.forEach((item) => {
        const dayKey = item.day as keyof WeeklyAvailability;
        if (!(dayKey in availabilitiesMap)) {
          console.warn(`Día desconocido:`);
          return;
        }
        // Si isWorking es true, mapeamos intervalos. Si es false, intervals no debe existir.
        availabilitiesMap[dayKey] = item.isWorking
          ? {
              DayKey: dayKey,
              isWorking: true,
              intervals: (item.intervals ?? []).map((interval: any) => ({
                startTime: interval.startTime,
                endTime: interval.endTime,
              })) as [TimeRange, ...TimeRange[]],
            }
          : { DayKey: dayKey, isWorking: false }; // Aquí intervals no existe (gracias al tipo 'never')
      });

      return { success: true, data: availabilitiesMap };
    } catch (e) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },

  /**
   * POST: Crea una nueva disponibilidad para un día específico.
   */
  async create(
    createAvailDto: AvailabilityDTO,
  ): Promise<OperationResult<Availability, AvailErrorCode>> {
    try {
      const response = await fetch(`${AVAILABILITY_ENDPOINT}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createAvailDto),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code ?? "AVAIL_NETWORK_ERROR", // Respetamos el code del backend
            message: data.message ?? "Error desconocido",
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (e) {
      // Error de red, timeout, JSON malformado, etc.
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },
};
