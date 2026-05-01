import type {Booking} from "../types";

export const mockBooking: Booking = {
    id: "b1",
    barber: {
        id: "b1",
        name: "John Doe"
    },
    customer: {
        id: "c1",
        name: "Eze Smith"
    },
    offer: {
        id: "s1",
        title: "Haircut",
        price: 14.000,
        duration: 60
    },
    type: "appt",
    date: "2026-03-27",
    startTime: "14:00",
    endTime: "15:00",
};
