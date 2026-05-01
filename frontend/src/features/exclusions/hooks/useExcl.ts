import { useState } from "react";
import type { Exception } from "@/shared/types";

export function useExcl(initial: Exception[] = []) {
  const [exceptions, setExceptions] = useState<Exception[]>(
    initial.length > 0
      ? initial
      : [
          {
            id: "e1",
            startDate: "2026-04-01",
            endDate: "2026-04-15",
            reason: "Vacaciones anuales",
            type: "range",
          },
        ],
  );

  const addException = (exception: Exception) => {
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
