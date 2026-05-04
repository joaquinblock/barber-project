import { useAvail } from "./useAvail";

//Exporta para el publico (solo lectura)
export const useAvailSchedule = (barberId: string, barbershopId: string) => {
  const { schedule, isLoading } = useAvail(barberId, barbershopId);
  return { schedule, isLoading };
};
