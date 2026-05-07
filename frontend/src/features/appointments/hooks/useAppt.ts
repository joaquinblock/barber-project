import { useState } from "react";
import { findConflict } from "@/shared/utils/time-utils";
import type {BanFormData} from "../types";
import type { Appt, DateKey} from "@/shared/types";
import type { OperationResult } from "@/shared/types";
import { ErrorCode } from "@barber/shared/errors";

//Usamos un DateKey para pedir por semana, en la base de datos las consultas son por semana

export const useAppointments = (initialData: Record<DateKey, Appt[]> = {}) => { 
  const [appts, setAppts] = useState<Record<DateKey, Appt[]>>(initialData);

  const addBlock = (formData: BanFormData): OperationResult<Appt, ErrorCode> => {
    const targetDate = formData.date;
    const dayAppts = appts[targetDate] || [];
    
    // 1. Validaciones de lógica (Globales)
    if (formData.startTime >= formData.endTime) {
      return { success: false, error: { code: ErrorCode.BAD_REQUEST, message: 'El horario de inicio debe ser anterior al de fin.' } };
    }

    // 2. Validación de Conflictos (Específicos de Negocio)
    const conflict = findConflict(formData, dayAppts);
    if (conflict) {
      const isAppt = conflict.type === 'appt';
      return { 
        success: false, 
        error: { 
          code: isAppt ? ErrorCode.APPT_BLOCK_OVERLAP_APPT : ErrorCode.APPT_BLOCK_OVERLAP_BLOCK,
          message: isAppt ? `el turno de ${conflict.customer}` : `el bloqueo "${conflict.reason}"`
        } 
      };
    }

    const newAppt: Appt = { id: Date.now().toString(), ...formData };

    setAppts(prev => ({
      ...prev,
      [targetDate]: [...(prev[targetDate] || []), newAppt].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ),
    }));

    return { success: true, data: newAppt };
  };

  const deleteItem = (date: DateKey, id: string) => {
    setAppts(prev => ({
      ...prev,
      [date]: (prev[date] || []).filter(item => item.id !== id)
    }));
  };

  return { appts, addBlock, deleteItem };
};