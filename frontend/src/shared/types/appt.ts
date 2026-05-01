import type { Offers } from "./barber-config";
import type { DateKey, TimeRange} from "./time";
import type {Barber, User} from "@/core/auth/types";

type BarberAppt = Pick<Barber, 'id' | 'name'>;
type CustomerAppt = Pick<User, 'id' | 'name'>;
    
export type ApptType = Appt['type'];

export type Appt = {
  id: string
  date: DateKey
  barber: BarberAppt
} & TimeRange & (
  | { type: 'appt'; customer: CustomerAppt; offer: Offers}
  | { type: 'blocked'; reason: string }
)

export type ApptsByDay = Map<DateKey, Appt[]>;

export type Booking = Extract<Appt, { type: 'appt' }>
export type BlockedTime = Extract<Appt, { type: 'blocked' }>