export type Day = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type DayName = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export type DateKey = `${number}-${number}-${number}`; // Formato YYYY-MM-DD


export type HourString = `${number}:${number}`;

export type TimeRangeRequest = {
    readonly startTime: HourString; // "09:00"
    readonly endTime: HourString;   // "17:00"
};

export type TimeRangeResponse = TimeRangeRequest & {
    readonly id: string;
};

export type DateRange = {
    readonly from: DateKey;
    readonly to: DateKey | null;
}



