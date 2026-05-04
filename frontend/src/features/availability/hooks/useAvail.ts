import { AVAIL_ERROR_MESSAGES } from "../constants/error";
import type { OperationResult } from "@/shared/types";
import { useState, useEffect } from "react";
import { findConflict, validateBasicTimeRange } from "@/shared/utils/time-utils";
import { AvailService } from "../services/avail.service";
import type { AvailErrorCode } from "../types";
import type { WeeklyAvailability } from "../types";
import type { AvailabilityDTO, AvailabilityResponseDTO, DayKey, TimeRangeRequest, TimeRangeResponse } from "@barber/shared/types";

export const useAvail = (barberId: string, barbershopId: string) => {
  const [schedule, setSchedule] = useState<WeeklyAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<AvailErrorCode | null>(null); 

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);
      const result = await AvailService.getByBarber(barberId, barbershopId);

      if (result.success) {
        const items = result.data;
        const availabilitiesMap: WeeklyAvailability = {
          MON: { dayKey: "MON", isWorking: false },
          TUE: { dayKey: "TUE", isWorking: false },
          WED: { dayKey: "WED", isWorking: false },
          THU: { dayKey: "THU", isWorking: false },
          FRI: { dayKey: "FRI", isWorking: false },
          SAT: { dayKey: "SAT", isWorking: false },
          SUN: { dayKey: "SUN", isWorking: false },
        };

        items.forEach((item: AvailabilityResponseDTO) => {
          const dayKey = item.dayOfWeek as keyof WeeklyAvailability;
          if (!(dayKey in availabilitiesMap)) {
            console.warn(`Día desconocido: ${dayKey}`);
            return;
          }

          const dayConfig = availabilitiesMap[dayKey];
          if (!dayConfig.isWorking) {
            availabilitiesMap[dayKey] = {
              dayKey: dayKey,
              isWorking: true,
              intervals: [{ 
                id: item.id, 
                startTime: item.startTime as any, 
                endTime: item.endTime as any 
              }],
            };
          } else {
            dayConfig.intervals.push({ 
              id: item.id, 
              startTime: item.startTime as any, 
              endTime: item.endTime as any 
            });
          }
        });

        setSchedule(availabilitiesMap);
      } else {
        setError(result.error.code as AvailErrorCode);
      }
      setIsLoading(false);
    };

    fetchSchedule();
  }, [barberId, barbershopId]);

  const addInterval = async (
    day: DayKey,
    range: TimeRangeRequest,
  ): Promise<OperationResult<TimeRangeResponse, AvailErrorCode>> => {

    // Guard de schedule no cargado
    if (!schedule) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Schedule no cargado" },
      };
    }

    // Validación local primero — barata, no requiere red
    const validationError = validateBasicTimeRange(range);
    if (validationError) {
      return {
        success: false,
        error: { code: validationError, message: AVAIL_ERROR_MESSAGES[validationError] },
      };
    }

    const dayData = schedule[day];
    const currentIntervals = dayData.isWorking ? dayData.intervals : [];

    const conflict = findConflict(range, currentIntervals);
    if (conflict) {
      return {
        success: false,
        error: { code: "WORK_BLOCK_OVERLAP", message: AVAIL_ERROR_MESSAGES.WORK_BLOCK_OVERLAP },
      };
    }

    setIsSaving(true);
    const result = await AvailService.create({
      dayOfWeek: day,
      startTime: range.startTime,
      endTime: range.endTime,
      barberId,
      barbershopId,
    } as AvailabilityDTO);
    setIsSaving(false);

    if (!result.success) {
      return {
        success: false,
        error: { code: result.error.code as AvailErrorCode, message: result.error.message },
      };
    }

    const createdInterval = result.data;

    setSchedule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [day]: {
          dayKey: day,
          isWorking: true,
          intervals: [...currentIntervals, { id: createdInterval.id, startTime: createdInterval.startTime as any, endTime: createdInterval.endTime as any }],
        },
      };
    });

    return { success: true, data: { id: createdInterval.id, startTime: createdInterval.startTime as any, endTime: createdInterval.endTime as any } as TimeRangeResponse };
  };

  const deleteInterval = async (
    day: DayKey,
    rangeId: string,
  ): Promise<OperationResult<void, AvailErrorCode>> => {
    if (!schedule) {
      return {
        success: false,
        error: { code: "SERVER_ERROR", message: "Schedule no cargado" },
      };
    }

    const dayData = schedule[day];
    const currentIntervals = dayData.isWorking ? dayData.intervals : [];

    setIsSaving(true);
    const result = await AvailService.delete(rangeId);
    setIsSaving(false);

    if (!result.success) {
      return {
        success: false,
        error: { code: result.error.code as AvailErrorCode, message: result.error.message },
      };
    }

    setSchedule((prev) => {
      if (!prev) return prev;
      const remainingIntervals = currentIntervals.filter((interval) => interval.id !== rangeId);
      
      if (remainingIntervals.length === 0) {
        return {
          ...prev,
          [day]: { dayKey: day, isWorking: false },
        };
      }

      return {
        ...prev,
        [day]: {
          dayKey: day,
          isWorking: true,
          intervals: remainingIntervals as [TimeRangeResponse, ...TimeRangeResponse[]],
        },
      };
    });

    return { success: true, data: undefined };
  };

  const toggleWorkingStatus = async (
    day: DayKey,
    isWorking: boolean,
  ): Promise<OperationResult<void, AvailErrorCode>> => {
    if (!schedule) return { success: false, error: { code: "SERVER_ERROR", message: "Schedule no cargado" } };

    if (!isWorking) {
      // Si apagamos, borramos todo en el backend
      setIsSaving(true);
      const result = await AvailService.deleteByDay(barberId, day);
      setIsSaving(false);

      if (!result.success) {
        return { success: false, error: { code: result.error.code as AvailErrorCode, message: result.error.message } };
      }

      setSchedule((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [day]: { dayKey: day, isWorking: false },
        };
      });
    } else {
      // Si prendemos, solo actualizamos el estado local para permitir agregar intervalos
      // No tocamos el backend todavía, el backend se toca al hacer 'create' del primer intervalo
      setSchedule((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [day]: { 
            dayKey: day, 
            isWorking: true, 
            intervals: [] as any // Temporalmente vacío hasta que el usuario agregue uno
          },
        };
      });
    }

    return { success: true, data: undefined };
  };

  return {
    schedule,
    isLoading,
    isSaving, // el componente puede deshabilitar el botón mientras guarda
    error,
    addInterval,
    deleteInterval,
    toggleWorkingStatus,
  };
};