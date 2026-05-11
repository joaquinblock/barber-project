import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExclusionService } from "../services/exclusion.service";
import { HttpError } from "@barber/shared";
import { toast } from "sonner";

export const useGetExclusions = () => {
  const {data: exceptions, isLoading, isError, error} = useQuery({
    queryKey: ["exceptions"],
    queryFn: async () => ExclusionService.getByBarber(),
  });

  return { exceptions, isLoading, isError, error };
}

export const useCreateFullDayException = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { startDate: string, reason: string | null }) => ExclusionService.createFullDay(data.startDate, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      toast.success("Excepción agregada correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError) {
         toast.error(error.message);
      } else {
        toast.error("Error al agregar la excepción.");
      }
    }
  });
  return mutation;
}

export const useCreateRangeException = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { startDate: string, endDate: string, reason: string | null }) => ExclusionService.createRange(data.startDate, data.endDate, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      toast.success("Excepción agregada correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError) {
         toast.error(error.message);
      } else {
        toast.error("Error al agregar la excepción.");
      }
    }
  });
  return mutation;
}

export const useDeleteException = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => ExclusionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      toast.success("Excepción eliminada correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar la excepción.");
      }
    }
  });
  return mutation;
}