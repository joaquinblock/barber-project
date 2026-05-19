import Stepper from "@/shared/components/ui/Stepper/Stepper";
import { Suspense, useMemo, useState } from "react";
import { BookingDate } from "../BookingDate/BookingDate";
import { BookingService } from "../BookingService/BookingService";
import { BookingTime } from "../BookingTime/BookingTime";
import { Button, FeatureErrorBoundary } from "@/shared/components/ui";
import styles from "./booking-manager.module.css";
import { formatDateToDayKey, formatDateToKey, groupApptsByDay } from "@/shared/utils/time-utils";
import { useGetOffers } from "@/features/offers";
import type { DateKey, HourString, OfferResponseDTO } from "@business/shared";


const BookingManagerContent = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const { offers, isError, error} = useGetOffers();

  // === Servicio seleccionado ===
  const [selectedOffer, setSelectedOffer] = useState<OfferResponseDTO | null>(null);

  const handleSelectService = (offer: OfferResponseDTO) => {
    setSelectedOffer(offer);
    console.log("Servicio seleccionado:", offer);
  };

  // === Día seleccionado ===

  const [daySelected, setDaySelected] = useState<DateKey>(
    formatDateToKey(new Date()),
  );

  const handleDaySelect = (day: DateKey) => {
    setDaySelected(day);
  };

  // === Horario seleccionado ===
  const [timeSelected, setTimeSelected] = useState<HourString | null>(null);
  
  const handleTimeSelect = (time: HourString) => {
    setTimeSelected(time);
  }



  function renderStep() {
    switch (step) {
      case 1:
        return <div>Hola</div>;
      case 2:
        return (
          <BookingService
            offers={offers}
            selectedOffer={selectedOffer}
            onSelectOffer={handleSelectService}
          ></BookingService>
        );
      case 3:
        return (<div>Hola</div>
          // <BookingDate
          //   daySelected={daySelected}
          //   onSelect={handleDaySelect}
          //   isDayBlocked={isDayBlocked}
          //   isWorking={isWorking}
          //   exceptionForSelectedDay={exceptionForSelectedDay}
          // ></BookingDate>
        );
      case 4:
        return (<div>Hola</div>
          //   schedule={availability.schedule}
          //   daySelected={daySelected}
          //   selectedTime={timeSelected}
          //   dayAppts={dayAppts}
          //   onSelectTime={handleTimeSelect}
          // ></BookingTime>
        );
      default:
        return null;
    }
  }

  const handleStep = (step: number) => {
    if (step <= totalSteps && step > 0) {
      setStep(step);
    }
  };


  return (
    <div className={styles.bookingManagerSection}>
      <Stepper step={step} total={totalSteps}></Stepper>
      {renderStep()}
      <div className={styles.buttonContainerStepper}>
        {step > 1 && (
          <Button onClick={() => handleStep(step - 1)} disabled={step === 1}>
            Anterior
          </Button>
        )}
        {step < totalSteps && (
          <Button variant="primary"
            onClick={() => handleStep(step + 1)}
            disabled={step === totalSteps}
          >
            Siguiente
          </Button>
        )}
        {step === totalSteps && (
          <Button variant="primary" onClick={() => alert("Reserva confirmada!")} >
            Confirmar Reserva
          </Button>
        )}
      </div>
    </div>
  );
};

export const BookingManager = () => (
  <FeatureErrorBoundary featureName="Booking">
    <Suspense fallback={<div>Cargando reserva...</div>}>
      <BookingManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);

