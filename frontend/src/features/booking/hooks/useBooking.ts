import type { Appt, DateKey, OperationResult, Service } from "@/shared/types";
import type { BookingFormData } from "../types";
import type { ApptErrorCode } from "@/features/appointments/types";
import { useState } from "react";
import type { Barber } from "@/core/auth/types/user";

export const useBooking = (onConfirm: (formData: BookingFormData) => OperationResult<Appt, ApptErrorCode>) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selection, setSelection] = useState<Partial<BookingFormData>>({});

  const selectBarber  = (barber: Barber)   => { setSelection(prev => ({ ...prev, barber }));   setStep(2); };
  const selectService = (service: Service) => { setSelection(prev => ({ ...prev, service }));  setStep(3); };
  const selectDate    = (date: DateKey)    => { setSelection(prev => ({ ...prev, date }));     setStep(4); };

  const goBack = () => setStep(prev => (prev > 1 ? prev - 1 as any : prev));

  return { step, selection, selectBarber, selectService, selectDate, goBack };
};