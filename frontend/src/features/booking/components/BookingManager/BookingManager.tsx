import Stepper from "@/shared/components/ui/Stepper/Stepper";
import { Suspense, useMemo, useState } from "react";
import { BookingDate } from "../BookingDate/BookingDate";
import { BookingService } from "../BookingService/BookingService";
import { BookingTime } from "../BookingTime/BookingTime";
import { Button, FeatureErrorBoundary } from "@/shared/components/ui";
import styles from "./booking-manager.module.css";
import type { useBarberConfig } from "@/shared/hooks/useBarberConfig";
import type { Exception, Service } from "@/shared/types/barber-config";
import type { DateKey, HourString } from "@/shared/types/time";
import { formatDateToDayKey, formatDateToKey, groupApptsByDay } from "@/shared/utils/time-utils";
import type { Appt} from "@/shared/types";

type BookingManagerProps = {
  appts: Appt[]; // Todos los appts, el componente se encarga de agruparlos por día y pasarlos filtrados a BookingTime
  barberConfig: ReturnType<typeof useBarberConfig>;
};

const BookingManagerContent = ({ appts, barberConfig }: BookingManagerProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const services = barberConfig.services;
  const availability = barberConfig.availability;
  const exceptions = barberConfig.exceptions;

  // === Servicio seleccionado ===
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    console.log("Servicio seleccionado:", service);
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

  // Se recalcula solo cuando cambia el array de appts
  const apptsByDay = useMemo(() => groupApptsByDay(appts), [appts]);

  // BookingTime solo recibe los appts del día que le importan
  const dayAppts = daySelected ? (apptsByDay.get(daySelected) ?? []) : [];


    // Lógica para desactivar botones según el paso y selección
  // Paso 3: chequear si el día tiene excepción o no trabaja
  let isDayBlocked = false;
  let isWorking = true;
  let exceptionForSelectedDay: Exception | undefined = undefined;
  
  if (step === 3 && daySelected) {
    // Excepciones: buscar si el día está dentro de algún rango de excepción
    const exception = exceptions.exceptions.find((ex) => {
       return daySelected >= ex.startDate && daySelected <= ex.endDate;
    });
    
    isDayBlocked = !!exception;
    exceptionForSelectedDay = exception;
    // Horario laboral
    isWorking = !!availability.schedule[formatDateToDayKey(daySelected)]?.isWorking;
  }

  const isNextDisabled =
    (step === 2 && !selectedService) ||
    (step === 3 && (!daySelected || isDayBlocked || !isWorking)) ||
    (step === 4 && !timeSelected);


  function renderStep() {
    switch (step) {
      case 1:
        return <div>Hola</div>;
      case 2:
        return (
          <BookingService
            services={services.services}
            selectedService={selectedService}
            onSelectService={handleSelectService}
          ></BookingService>
        );
      case 3:
        return (
          <BookingDate
            daySelected={daySelected}
            onSelect={handleDaySelect}
            isDayBlocked={isDayBlocked}
            isWorking={isWorking}
            exceptionForSelectedDay={exceptionForSelectedDay}
          ></BookingDate>
        );
      case 4:
        return (
          //Exception no va porque el bloqueo se muestra en el paso anterior, entonces acá solo mostramos los horarios disponibles según el día seleccionado
          <BookingTime
            schedule={availability.schedule}
            daySelected={daySelected}
            selectedTime={timeSelected}
            dayAppts={dayAppts}
            onSelectTime={handleTimeSelect}
          ></BookingTime>
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
            disabled={step === totalSteps || isNextDisabled}
          >
            Siguiente
          </Button>
        )}
        {step === totalSteps && (
          <Button variant="primary" onClick={() => alert("Reserva confirmada!")} disabled={isNextDisabled}>
            Confirmar Reserva
          </Button>
        )}
      </div>
    </div>
  );
};

export const BookingManager = (props: BookingManagerProps) => (
  <FeatureErrorBoundary featureName="Booking">
    <Suspense fallback={<div>Cargando reserva...</div>}>
      <BookingManagerContent {...props} />
    </Suspense>
  </FeatureErrorBoundary>
);

