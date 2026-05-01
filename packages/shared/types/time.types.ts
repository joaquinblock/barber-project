export type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type DateKey = `${number}-${number}-${number}`; // Formato YYYY-MM-DD


export type HourString = `${number}:${number}`;

export type TimeRange = {
    readonly startTime: HourString; // "09:00"
    readonly endTime: HourString;   // "17:00"
};

