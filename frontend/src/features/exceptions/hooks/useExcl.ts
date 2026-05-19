import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExclusionService } from "../services/exclusion.service";
import { handleMutationError } from "@/shared/utils/error.utils";
import { toast } from "sonner";

export const useGetExclusions = () => {
  const {data: exceptions, isLoading, isError, error, refetch} = useQuery({
    queryKey: ["exceptions"],
    queryFn: async () => ExclusionService.getByBarber(),
  });

  return { exceptions, isLoading, isError, error, refetch };
}

export const useCreateFullDayException = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: { startDate: string, reason: string | null }) => ExclusionService.createFullDay(data.startDate, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      toast.success("Excepción agregada correctamente.");
    },
    // El error se maneja en el componente con un Alert
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
    // El error se maneja en el componente con un Alert
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
    onError: handleMutationError, // Delete usa Toast automático
  });
  return mutation;
}