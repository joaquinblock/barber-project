import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AvailService } from "../services/avail.service";
import { toWeeklyAvail } from "../utils/toWeeklyAvail.util";
import type {CreateAvailRequestDTO, DayKey} from "@business/shared/types";
import { toast } from "sonner";
import { ErrorCode } from "@business/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";

// ---------------------------------------------------------
// 1. Hook para LEER (GET)
// 
// Use suspense, quiere decir que si o si tiene que esperar a que cargue los datos

// ---------------------------------------------------------

export const useGetAvailability = () => {
  const { data, refetch, isLoading, isError, error } = useSuspenseQuery({
    queryKey: ["availability"],
    queryFn: () => AvailService.getAvailByBarber(),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    select: (data) => {
      const weeklyAvail = toWeeklyAvail(data);
      //Devolverlos ordenados
      Object.values(weeklyAvail).forEach(dayData => {
          if (dayData?.intervals && dayData.intervals.length > 1){
            dayData.intervals.sort((a, b) => a.startTime.localeCompare(b.startTime));
          }
      });

      return weeklyAvail
    }
  });

  return { availability: data ?? [], refetch, isLoading, isError, error };
};

// ---------------------------------------------------------
// 2. Hook para CREAR (POST)
// ---------------------------------------------------------
export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

   return useMutation({
    // Retorno implícito
    mutationFn: (availData: CreateAvailRequestDTO) => AvailService.createAvail(availData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Disponibilidad creada correctamente");
    },
    onError: (error) => {
      toast.error("Error al crear disponibilidad: " + error.message);
    },
  });
};

// ---------------------------------------------------------
// 3. Hook para ACTUALIZAR (PUT)
// ---------------------------------------------------------
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({idAvail, updateAvailDto}: {idAvail: string, updateAvailDto: Partial<CreateAvailRequestDTO>}) => AvailService.updateAvail(idAvail, updateAvailDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Disponibilidad actualizada correctamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar disponibilidad: " + error.message);
    },
  });
};

// ---------------------------------------------------------
// 4. Hook para BORRAR (DELETE)
// ---------------------------------------------------------
export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idAvail: string) => AvailService.deleteAvail(idAvail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Disponibilidad eliminada correctamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar disponibilidad: " + error.message);
    },
  });
};

// ------ ---------------------------------------------------
// 5. Hook para BORRAR POR DIA COMPLETO(DELETE)
// (Este se usa para cuando queres poner que no trabajas un dia y tenes varios horarios)
// ---------------------------------------------------------
export const useDeleteByDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (day: string) => await AvailService.deleteByDay(day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Disponibilidad eliminada correctamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar disponibilidad: " + error.message);
    },
  });
};
// ---------------------------------------------------------
// 6. Hook COMPUESTO para el componente AvailManager (Mantiene compatibilidad)
// ---------------------------------------------------------
export const useAvail = () => {
  const { availability: schedule, refetch } = useGetAvailability();
  
  const { mutateAsync: createAvailAsync } = useCreateAvailability();
  const { mutate: deleteIntervalMutate } = useDeleteAvailability();
  const { mutate: deleteByDayMutate } = useDeleteByDay();

  const addInterval = async (data: CreateAvailRequestDTO) => {
    // 1. Validar solapamiento localmente para UX
    const dayAvail = schedule?.[data.dayOfWeek as DayKey];
    if (dayAvail && dayAvail.isWorking) {
        const hasOverlap = dayAvail.intervals.some(interval => {
            // Condición de solapamiento: (start1 < end2) AND (end1 > start2)
            return data.startTime < interval.endTime && data.endTime > interval.startTime;
        });

        if (hasOverlap) {
            return { 
                success: false, 
                error: { 
                  code: ErrorCode.AVAIL_OVERLAP, 
                  message: ERROR_MESSAGES[ErrorCode.AVAIL_OVERLAP] || 'El horario se superpone con un bloque existente.'
                } 
            };
        }
    }

    try {
      await createAvailAsync(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const deleteInterval = (day: DayKey, id: string) => {
    deleteIntervalMutate(id);
  };

  const toggleWorkingStatus = (day: DayKey, isWorking: boolean): Promise<void> => {
    if (!isWorking) {
      deleteByDayMutate(day);
    } 
    return Promise.resolve();
  };

  return {
    schedule,
    refetch,
    addInterval,
    deleteInterval,
    toggleWorkingStatus
  };
};
