import type { DateKey } from "@barber/shared/types";

type ExceptionType = 'full_day' | 'range';

export type Exception = {
    id: string;
    startDate: DateKey; // "2026-03-27"
    endDate: DateKey;   // "2026-03-29" (Si es un solo día, es la misma que startDate)
    reason: string;     // "Vacaciones", "Feriado", "Cerrado por reformas"
    type: ExceptionType; // 'full_day' para días completos, 'range' para rangos de fechas (startDate != endDate)
};