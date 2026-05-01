import { useState } from "react";
import { findConflict } from "@/shared/utils/time-utils";
import type {BanFormData} from "../types";
import type { Appt, DateKey} from "@/shared/types";
import type { OperationResult } from "@/shared/types";
import type { ApptErrorCode } from "../types";

//Usamos un DateKey para pedir por semana, en la base de datos las consultas son por semana

export const useAppointments = (initialData: Record<DateKey, Appt[]> = {}) => { 
  const [appts, setAppts] = useState<Record<DateKey, Appt[]>>(initialData);

  const addBlock = (formData: BanFormData): OperationResult<Appt, ApptErrorCode> => {
    const targetDate = formData.date;
    const dayAppts = appts[targetDate] || [];
    
    // 1. Validaciones de lógica (Globales)
    if (formData.startTime >= formData.endTime) {
      return { success: false, error: { code: 'INVALID_RANGE', message: '...' } };
    }

    // 2. Validación de Conflictos (Específicos de Negocio)
    const conflict = findConflict(formData, dayAppts);
    if (conflict) {
      const isAppt = conflict.type === 'appt';
      return { 
        success: false, 
        error: { 
          code: isAppt ? 'BLOCK_OVERLAP_APPT' : 'BLOCK_OVERLAP_BLOCK',
          // El message crudo lo mandamos por las dudas
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