import type { Appt } from "@/shared/types";

export type BookingFormData = Omit<Extract<Appt, { type: 'appt' }>, 'id'>;