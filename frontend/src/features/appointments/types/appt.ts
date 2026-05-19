import type { Barber, Customer, DateKey, TimeRangeResponse, OfferDTO, ApptStatus } from "@business/shared/types";


type BarberAppt = Pick<Barber, 'id'> & {name: string};
type CustomerAppt = Pick<Customer, 'id'> & {name: string};
    
export type ApptType = Appt['type'];

export type Appt = {
  id: string
  date: DateKey
  barber: BarberAppt
} & TimeRangeResponse & (
  | { type: 'appt'; customer: CustomerAppt; offer: OfferDTO}
  | { type: 'blocked'; reason: string }
)

export type ApptsByDay = Map<DateKey, Appt[]>;

export type Booking = Extract<Appt, { type: 'appt' }>
export type BookingHistory = Booking & { status: ApptStatus }
export type BlockedTime = Extract<Appt, { type: 'blocked' }>
