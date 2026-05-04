import type { BarberConfig } from "@/shared/types";

export const barberConfigMock: BarberConfig = {
    barberId: "b1",
    offers: [
        { id: "s1", title: "Corte de cabello", price: 14000, duration: 30 },
        { id: "s2", title: "Afeitado clásico", price: 10000, duration: 20 },
        { id: "s3", title: "Corte + Afeitado", price: 22000, duration: 50 },
    ],
    availabilities: {
        'MON': {
            dayKey: 'MON',
            isWorking: true,
            intervals: [
                { id: "i1", startTime: "09:00", endTime: "18:00" },
            ],
        },
        'TUE': {
            dayKey: 'TUE',
            isWorking: true,
            intervals: [
                { id: "i2", startTime: "10:00", endTime: "17:00" },
            ],
        },
        'WED': {
            dayKey: 'WED',
            isWorking: false,
            //intervals: [],
        },
        'THU': {
            dayKey: 'THU',
            isWorking: true,
            intervals: [
                { id: "i3", startTime: "11:00", endTime: "19:00" },
            ],
        },
        'FRI': {
            dayKey: 'FRI',
            isWorking: true,
            intervals: [
                { id: "i4", startTime: "09:00", endTime: "18:00" },
            ],
        },
        'SAT': {
            dayKey: 'SAT',
            isWorking: false,
            //intervals: [],
        },
        'SUN': {
            dayKey: 'SUN',
            isWorking: false,
            //intervals: [],
        }
     },
    exceptions: [
        {
            id: "e1",
            startDate: "2026-03-27",
            endDate: "2026-03-29",
            reason: "Vacaciones de Semana Santa",
            type: "range",
        },
        {
            id: "e2",
            startDate: "2026-04-10",
            endDate: "2026-04-10",
            reason: "Día de descanso",
            type: "full_day",
        },
    ],
};
