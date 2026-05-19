

export type ResponseProfessionalDTO = {
  id: string;
  slotDurationMinutes: number | null;
  bio: string | null;
  photoUrl: string | null;
  commissionPercent: number | null;
  calendarColor: string | null;
  isAvailable: boolean;
  userId: string;
  businessId: string;
};

export type CreateProfessionalDTO = { 
  slotDurationMinutes: number | null;
  bio: string | null;
  photoUrl: string | null;
  commissionPercent: number | null;
  calendarColor: string | null;
};
