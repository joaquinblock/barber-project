import { AVAIL_ERROR_MESSAGES } from "../constants/error";
import type { OperationResult } from "@/shared/types";
import { useState, useEffect } from "react";
import { findConflict, validateBasicTimeRange } from "@/shared/utils/time-utils";
import { AvailService } from "../services/avail.service";
import type { AvailErrorCode } from "../types";
import type { WeeklyAvailability} from "@/shared/types/avail";
import type { AvailabilityDTO, DayKey, TimeRange } from "@barber/shared/types";

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
        setSchedule(result.data);
      } else {
        setError(result.error.code as AvailErrorCode);
      }
      setIsLoading(false);
    };

    fetchSchedule();
  }, [barberId, barbershopId]);

  const addInterval = async (
    day: DayKey,
    range: TimeRange,
  ): Promise<OperationResult<TimeRange, AvailErrorCode>> => {

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

    // ✅ Recién acá llamamos al backend, con await
    setIsSaving(true);
    const result = await AvailService.create({
      dayOfWeek: day,
      isWorking: true,
      intervals: [...currentIntervals, range],
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

    // Solo actualizamos el estado local si el backend confirmó
    setSchedule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [day]: {
          DayKey: day,
          isWorking: true,
          intervals: [...currentIntervals, range],
        },
      };
    });

    return { success: true, data: range };
  };

  return {
    schedule,
    isLoading,
    isSaving, // el componente puede deshabilitar el botón mientras guarda
    error,
    addInterval,
  };
};