export type ApptType = 'appt' | 'blocked';
export type ApptStatus = 'pending' | 'confirmed' | 'cancelled' | 'finished';

export type ApptDTO = {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: ApptType;
  professionalId: string;
  businessId: string;
  customerId: string | null;
  offerId: string | null;
  reason: string | null;
  priceSnapshot: number | null;
  durationSnapshot: number | null;
};

export type ApptResponseDTO = ApptDTO & {
  id: string;
  status: ApptStatus;
};
