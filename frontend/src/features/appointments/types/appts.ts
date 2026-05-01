import type { Appt} from "@/shared/types";


export type BanFormData = Omit<Extract<Appt, { type: 'blocked' }>, 'id'>;