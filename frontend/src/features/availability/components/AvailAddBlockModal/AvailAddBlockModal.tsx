import { Modal, Button, Input } from "@/shared/components/ui";
import { useState } from "react";
import { ErrorInline } from "@/shared/components/ui";
import { CircleAlert } from "lucide-react";
import type { DayKey, HourString, TimeRangeRequest } from "@business/shared/types";
import type { WeeklyAvailability } from "../../types";
import { DAYS_CONFIG } from "@/shared/constants/days";
import styles from "./avail-add-block-modal.module.css";

type AvailAddBlockModalProps = {
  onClose: () => void;
  onConfirm: (timeRange: TimeRangeRequest) => Promise<boolean> | boolean;
  onCopy?: (fromDay: DayKey) => void;
  schedule?: WeeklyAvailability;
  currentDay?: DayKey;
  errorMessage?: string | null;
};

export const AvailAddBlockModal = ({
  onClose,
  onConfirm,
  onCopy,
  schedule,
  currentDay,
  errorMessage,
}: AvailAddBlockModalProps) => {
  const [localBlock, setLocalBlock] = useState<TimeRangeRequest>({
    startTime: "00:00" as HourString,
    endTime: "00:00" as HourString,
  });

  // Filtrar días que tienen horarios cargados y no es el día actual
  const copyableDays = schedule 
    ? (Object.keys(schedule) as DayKey[]).filter(day => 
        day !== currentDay && schedule[day].isWorking && schedule[day].intervals.length > 0
      )
    : [];

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    // onConfirm en el padre ya se encarga de cerrar si es exitoso
    await onConfirm(localBlock);
  };

  return (
    <Modal text="Agregar bloque de trabajo" onClose={onClose}>
      {copyableDays.length > 0 && (
        <div className={styles.copyContainer}>
          <p className={styles.copyLabel}>Copiar horarios desde:</p>
          <div className={styles.copyButtons}>
            {copyableDays.map(day => (
              <button 
                key={day} 
                className={styles.copyButton}
                onClick={() => onCopy && onCopy(day)}
                type="button"
              >
                {DAYS_CONFIG[day].letter}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className={styles.formContainer} onSubmit={handleConfirm}>
      <Input
        type="time" //el browser ya se encarga de validar el formato, no necesito regex ni nada
        variant="inline"
        label="Desde"
        readOnly={false} //si No es editable, el input es de solo lectura
        onChange={(e) => setLocalBlock(prev => ({ ...prev, startTime: e.target.value as HourString }))}
      />
      <Input
        type="time"
        variant="inline"
        label="Hasta"
        readOnly={false}
        onChange={(e) => setLocalBlock(prev => ({ ...prev, endTime: e.target.value as HourString }))}
      />
      {errorMessage && (
        <ErrorInline iconLeft={CircleAlert}>
          {errorMessage}
        </ErrorInline>
      )}
      <Button 
        type="submit"
        disabled={!localBlock.startTime || !localBlock.endTime}
        variant="primary"
      >
        Confirmar
      </Button>
      </form>
    </Modal>
  );
};
