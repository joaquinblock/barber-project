import type { DayKey, TimeRange } from '@barber/shared/types';

/*export type DailyAvailability = {
    isWorking: boolean;
    intervals?: TimeRange[]; // Solo tiene sentido si isWorking es true. Si es false, se ignora este campo.
};  

 Esto no va porque queremos que chequee el isWorking en cada bloque, para evitar inconsistencias. Si el día no tiene bloques, se asume que no labura ese día.
*/

type WorkingDay = {
    DayKey: DayKey;
    isWorking: true;
    intervals: [TimeRange, ...TimeRange[]]; //Esto obliga a que si isWorking es true, tenga al menos un bloque de trabajo. Si no tiene bloques, se asume que no labura ese día.
};

type NonWorkingDay = {
    DayKey: DayKey;
    isWorking: false;
    intervals?: never; // ✅ No existe cuando no trabaja con ? para que la propiedad sea opcional y no obligatoria
};

export type Availability = WorkingDay | NonWorkingDay;

export type WeeklyAvailability = Record<DayKey, Availability>;