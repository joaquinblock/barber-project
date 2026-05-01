import type { WeeklyAvailability } from "@/shared/types/barber-config";
import type { Appt } from "@/shared/types/appt";
import type { DateKey, HourString } from "@/shared/types";
import { formatDateToDayKey, isSlotOccupied } from "@/shared/utils/time-utils";
import { generateTimeSlots } from "@/shared/utils/time-utils";
import styles from "./booking-time.module.css";
import { Button } from "@/shared/components/ui";
import { useMemo } from "react";

type BookingTimeProps = {
  schedule: WeeklyAvailability;
  dayAppts: Appt[]; // ya filtrados por día,
  daySelected: DateKey;
  selectedTime?: HourString | null;
  onSelectTime?: (time: HourString) => void;
};

export const BookingTime = ({
  schedule,
  dayAppts,
  daySelected,
  selectedTime,
  onSelectTime,
}: BookingTimeProps) => {
  console.log(dayAppts);
  const occupiedSlots = useMemo(() => {
    // Retornamos una función que ya conoce los turnos del día
    return (slot: string) => isSlotOccupied(slot, dayAppts);
  }, [dayAppts]);

  if (!daySelected) {
    return <p>Seleccioná un día primero.</p>;
  }

  const daySchedule = schedule[formatDateToDayKey(daySelected)];

  if (!daySchedule?.isWorking) {
    return <p>El barbero no trabaja este día.</p>;
  }

  const allSlots = generateTimeSlots(daySchedule.intervals ?? []);

  if (allSlots.length === 0) {
    return <p>No hay horarios disponibles.</p>;
  }

  return (
    <div className={styles.timeLayout}>
      <div className={styles.slotGrid}>
        {allSlots.map((slot) => {
          const isOccupied = occupiedSlots(slot);
          const isSelected = selectedTime === slot;

          return (
            <Button
              key={slot}
              variant="selectable"
              disabled={isOccupied}
              isSelected={isSelected ?? false}
              size="lg"
              onClick={() => {
                if (!isOccupied) onSelectTime?.(slot);
              }}
            >
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
