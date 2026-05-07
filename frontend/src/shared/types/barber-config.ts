import type { WeeklyAvailability } from '@/features/availability/types';
import type { Exception } from '@/features/exceptions/types';
import type { Offers } from '@/features/offers/types';


export type BarberConfig = {
    readonly barberId: string;
    readonly offers: Offers[]; // El catálogo de este tipo
    readonly availabilities: WeeklyAvailability; // [L: isWorking:true, intervals: [{id:1, startTime:"09:00", endTime:"17:00"}], M: isWorking:true, intervals: [{id:2, startTime:"10:00", endTime:"16:00"}], X: isWorking:false, intervals: [], ...]
    readonly exceptions: Exception[]; // Días que no labura. 
};