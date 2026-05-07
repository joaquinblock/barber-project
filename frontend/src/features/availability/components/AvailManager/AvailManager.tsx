import { Clock } from "lucide-react";
import { useState } from "react";
import styles from "./avail-manager.module.css";
import { ErrorCode } from "@barber/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";
import type { DayKey, TimeRangeRequest} from "@barber/shared/types";
import { DAYS_CONFIG } from "@/shared/constants/days";
import { Suspense } from "react";
import { toast } from "sonner";

import {
  AvailDaySelector,
  AvailDayHeader,
  AvailTimeRange,
  AvailAddBlockModal,
} from "@/features/availability/components";
import { EmptyState, Title } from "@/shared/components/ui";
import { FeatureErrorBoundary } from "@/shared/components/ui";
import { useAvail } from "../../hooks/useAvail";



const AvailManagerContent = () => {
  
  const { schedule, addInterval, deleteInterval, toggleWorkingStatus } = useAvail();

  if (!schedule) return null;

  // 2. Solo datos de presntación y UI
  const [daySelected, setDaySelected] = useState<DayKey>('MON');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorAddBlock, setErrorAddBlock] = useState<string | null>(null);

  const handleOpenModalAddBlock = () => {
    setIsModalOpen(true);
  };

  // Le agregamos el parámetro 'isSuccess'
  const handleCloseModal = (day: DayKey, isSuccess: boolean = false) => {
    setIsModalOpen(false);
    setErrorAddBlock(null);

    // Solo hacemos el rollback si NO fue un éxito y el usuario dejó el switch prendido
    if (
      !isSuccess &&
      schedule[day].isWorking &&
      schedule[day].intervals.length === 0
    ) {
      toggleWorkingStatus(day, false);
    }
  };

  const handleToggle = async (val: boolean) => {
    console.log(val);
    //Tenemos que llamar primero porque sino no cambia el estado del switch
    //En handleCloseModal hacemos la validación de si el user prendió el switch pero no cargó nada, lo apagamos de nuevo.
    await toggleWorkingStatus(daySelected, val);

    schedule[daySelected].isWorking = val;

    const dayData = schedule[daySelected];

    if (val && dayData.isWorking && (dayData.intervals?.length ?? 0) === 0) {
      handleOpenModalAddBlock(); // 2. Si falta data, pedila
    }
  };

  const handleSelectDay = (day: DayKey) => setDaySelected(day);

  const handleDelete = (id: string) => deleteInterval(daySelected, id);

  const handleConfirmAdd = async (timeRange: TimeRangeRequest): Promise<boolean> => {
    // 1. Limpiamos el rastro de errores viejos
    setErrorAddBlock(null);

    const result = await addInterval({
      dayOfWeek: daySelected,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
    });

    if (result.success) {
      handleCloseModal(daySelected, true);
      return true;
    } else {
      const code = result.error?.code as ErrorCode;
      const message =
        ERROR_MESSAGES[code] ||
        result.error?.message ||
        "Error desconocido";
      setErrorAddBlock(message);
      return false;
    }
  };

  const handleCopy = async (fromDay: DayKey) => {
    const fromDayData = schedule[fromDay];
    if (!fromDayData || !fromDayData.isWorking) return;

    setIsModalOpen(false); // Cerramos el modal inmediatamente
    const toastId = toast.loading(`Copiando horarios desde ${DAYS_CONFIG[fromDay].full}...`);

    try {
      // Replicar cada intervalo del día origen al día destino
      const promises = fromDayData.intervals.map(interval => 
        addInterval({
          dayOfWeek: daySelected,
          startTime: interval.startTime,
          endTime: interval.endTime,
        })
      );

      const results = await Promise.all(promises);
      
      const hasErrors = results.some(r => !r.success);
      if (hasErrors) {
        toast.error("Algunos horarios no se pudieron copiar por solapamiento o error", { id: toastId });
      } else {
        toast.success(`Horarios copiados correctamente desde ${DAYS_CONFIG[fromDay].full}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Error al copiar horarios", { id: toastId });
    }
  };

  return (
    <div className={styles.availContainer}>
      <Title textTitle="Mis horarios" icon={Clock}></Title>
      <div className={styles.availSection}>
        <AvailDaySelector
          selectedDay={daySelected}
          onSelectDay={handleSelectDay}
          schedule={schedule}
        ></AvailDaySelector>
        <div className={styles.availWorkBlockSection}>
          <AvailDayHeader
            day={DAYS_CONFIG[daySelected].full}
            isWorking={schedule[daySelected].isWorking}
            onChange={handleToggle}
          ></AvailDayHeader>

          {schedule[daySelected].isWorking ? (
            <AvailTimeRange
              items={schedule[daySelected].isWorking ? schedule[daySelected].intervals : []}
              onClickAddBlock={handleOpenModalAddBlock}
              onDelete={handleDelete}
            ></AvailTimeRange>
          ) : (
            <EmptyState text="Dia no laborable" />
          )}
        </div>

        {isModalOpen && (
          <AvailAddBlockModal
            // Si cierra por la "X", isSuccess es false por defecto
            onClose={() => handleCloseModal(daySelected)}
            // Al confirmar, si sale bien, avisamos que es un ÉXITO
            onConfirm={handleConfirmAdd}
            onCopy={handleCopy}
            schedule={schedule}
            currentDay={daySelected}
            errorMessage={errorAddBlock}
          />
        )}
      </div>
    </div>
  );
};

export const AvailManager = () => (
  <FeatureErrorBoundary featureName="Availability">
    <Suspense fallback={<div>Loading...</div>}>
      <AvailManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);
