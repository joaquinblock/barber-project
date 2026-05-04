import { AVAIL_ERROR_MESSAGES } from "../../constants/error";
import { Clock } from "lucide-react";
import { useState } from "react";
import styles from "./avail-manager.module.css";
import type { AvailErrorCode } from "../../types";
import type { DayKey, TimeRangeRequest} from "@barber/shared/types";
import { DAYS_CONFIG } from "@/shared/constants/days";
import { Suspense } from "react";

import {
  AvailDaySelector,
  AvailDayHeader,
  AvailTimeRange,
  AvailAddBlockModal,
} from "@/features/availability/components";
import { EmptyState, Title } from "@/shared/components/ui";
import { useAvail } from "../../hooks/useAvail";

import { FeatureErrorBoundary } from "@/shared/components/ui";

type AvailManagerProps = {
  barberId: string 
  barbershopId: string
};

const AvailManagerContent = ({ barberId, barbershopId }: AvailManagerProps) => {
  
  const { schedule, addInterval, deleteInterval, toggleWorkingStatus } = useAvail(barberId, barbershopId);

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

  const handleToggle = (val: boolean) => {
    //Tenemos que llamar primero porque sino no cambia el estado del switch
    //En handleCloseModal hacemos la validación de si el user prendió el switch pero no cargó nada, lo apagamos de nuevo.
    toggleWorkingStatus(daySelected, val);

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

    const result = await addInterval(daySelected, timeRange);

    if (result.success) {
      handleCloseModal(daySelected, true);
      return true;
    } else {
      const code = result.error?.code as AvailErrorCode;
      const message =
        AVAIL_ERROR_MESSAGES[code] ||
        result.error?.message ||
        "Error desconocido";
      setErrorAddBlock(message);
      return false;
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
            errorMessage={errorAddBlock}
          />
        )}
      </div>
    </div>
  );
};

export const AvailManager = (props: AvailManagerProps) => (
  <FeatureErrorBoundary featureName="Availability">
    <Suspense fallback={<div>Loading...</div>}>
      <AvailManagerContent {...props} />
    </Suspense>
  </FeatureErrorBoundary>
);
