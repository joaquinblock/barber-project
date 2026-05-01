import type {
  Appt,
  BarberConfig,
  DateKey,
  DayKey,
  Exception,
  Offers,
  WeeklyAvailability,
} from "@/shared/types";

type BackendAvailability = {
  id: string;
  dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  isWorking: boolean;
  intervals: Array<{ startTime: string; endTime: string }> | null;
};

type BackendException = {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
  type: "full-day" | "range" | "full_day";
};

type BackendOffer = {
  id: string;
  title: string;
  price: number;
  duration: number;
  isActive?: boolean;
};

type BackendAppointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "appt" | "blocked";
  reason?: string;
  barberId: string;
  barber?: { id: string; name: string };
  customerId?: string;
  customer?: { id: string; name: string };
  offerId?: string;
  offer?: { id: string; title: string; price: number; duration: number };
  priceSnapshot?: number;
  durationSnapshot?: number;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:3000/barber-project-jb/api";

const DAY_OF_WEEK_TO_KEY: Record<BackendAvailability["dayOfWeek"], DayKey> = {
  MON: "L",
  TUE: "M",
  WED: "X",
  THU: "J",
  FRI: "V",
  SAT: "S",
  SUN: "D",
};

function createEmptyWeeklyAvailability(): WeeklyAvailability {
  return {
    L: { isWorking: false, intervals: [] },
    M: { isWorking: false, intervals: [] },
    X: { isWorking: false, intervals: [] },
    J: { isWorking: false, intervals: [] },
    V: { isWorking: false, intervals: [] },
    S: { isWorking: false, intervals: [] },
    D: { isWorking: false, intervals: [] },
  };
}

async function fetchJson<T>(path: string, query: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Error ${response.status} consultando ${path}`);
  }

  return (await response.json()) as T;
}

function mapAvailabilityToWeekly(rows: BackendAvailability[]): WeeklyAvailability {
  const weekly = createEmptyWeeklyAvailability();

  for (const row of rows) {
    const dayKey = DAY_OF_WEEK_TO_KEY[row.dayOfWeek];
    if (!dayKey) continue;

    weekly[dayKey] = {
      isWorking: Boolean(row.isWorking),
      intervals: (row.intervals ?? []).map((interval, index) => ({
        id: `${row.id}-${index}`,
        startTime: interval.startTime,
        endTime: interval.endTime,
      })),
    };
  }

  return weekly;
}

function mapExceptionType(type: BackendException["type"]): Exception["type"] {
  return type === "range" ? "range" : "full_day";
}

function mapOffers(rows: BackendOffer[]): Offers[] {
  return rows
    .filter((offer) => offer.isActive !== false)
    .map((offer) => ({
      id: offer.id,
      title: offer.title,
      price: Number(offer.price),
      duration: Number(offer.duration),
    }));
}

function mapAppointments(rows: BackendAppointment[]): Record<DateKey, Appt[]> {
  const byDay: Record<DateKey, Appt[]> = {};

  for (const row of rows) {
    const dateKey = row.date as DateKey;

    const base = {
      id: row.id,
      date: dateKey,
      startTime: row.startTime,
      endTime: row.endTime,
      barber: {
        id: row.barber?.id ?? row.barberId,
        name: row.barber?.name ?? "Barbero",
      },
    };

    const mapped: Appt =
      row.type === "blocked"
        ? {
            ...base,
            type: "blocked",
            reason: row.reason ?? "Bloqueo",
          }
        : {
            ...base,
            type: "appt",
            customer: {
              id: row.customer?.id ?? row.customerId ?? "unknown-customer",
              name: row.customer?.name ?? "Cliente",
            },
            offer: {
              id: row.offer?.id ?? row.offerId ?? "unknown-offer",
              title: row.offer?.title ?? "Servicio",
              price: Number(row.priceSnapshot ?? row.offer?.price ?? 0),
              duration: Number(row.durationSnapshot ?? row.offer?.duration ?? 0),
            },
          };

    if (!byDay[dateKey]) {
      byDay[dateKey] = [];
    }

    byDay[dateKey].push(mapped);
  }

  for (const date of Object.keys(byDay) as DateKey[]) {
    byDay[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return byDay;
}

export async function fetchBarberConfig(barberId: string): Promise<BarberConfig> {
  const [availabilityRows, exceptionRows, offerRows] = await Promise.all([
    fetchJson<BackendAvailability[]>("/availability", { barberId }),
    fetchJson<BackendException[]>("/exceptions", { barberId }),
    fetchJson<BackendOffer[]>("/offers", { barberId }),
  ]);

  return {
    barberId,
    availability: mapAvailabilityToWeekly(availabilityRows),
    exceptions: exceptionRows.map((item) => ({
      id: item.id,
      startDate: item.startDate as DateKey,
      endDate: item.endDate as DateKey,
      reason: item.reason ?? "Sin motivo",
      type: mapExceptionType(item.type),
    })),
    offers: mapOffers(offerRows),
  };
}

export async function fetchAppointmentsByBarber(
  barberId: string,
): Promise<Record<DateKey, Appt[]>> {
  const appts = await fetchJson<BackendAppointment[]>("/appointments", { barberId });
  return mapAppointments(appts);
}
