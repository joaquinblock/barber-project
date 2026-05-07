import { useState } from "react";
import type { ExceptionDTO } from "@barber/shared/types";
import { useQuery } from "@tanstack/react-query";

export function useExcl(barbershopId: string, barberId: string) {

  const { data: exceptions, isLoading, error } = useQuery({
    queryKey: ["exclusions", barbershopId, barberId],
    queryFn: () => fetchExclusions(barbershopId, barberId),
  });

  const addException = (exception: ExceptionDTO) => {
    setExceptions((prev) => [...prev, exception]);
  };

  const deleteException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    exceptions,
    addException,
    deleteException, // expone la función para eliminar excepciones
  };
}
