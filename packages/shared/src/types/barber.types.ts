export type Barber = {
  id: string;
  barbershopId: string;
  slotDurationMinutes: number;
  bio: string | null;
  photoUrl: string | null;
  commissionPercent: number;
  calendarColor: string | null;
  isAvailable: boolean;
};