import { Suspense, useState } from "react";
import { formatDateToKey } from "@/shared/utils/time-utils";
import type { BanFormData } from "@/features/appointments/types";
import {
  ApptList,
  ApptWorkBlock,
  ApptBanModal,
} from "@/features/appointments";
import { Button, Calendar, Title, FeatureErrorBoundary } from "@/shared/components/ui";
import { Ban, Briefcase } from "lucide-react";
import { formatDateToDisplay } from "@/shared/utils/time-utils";
import { useAppointments } from "../../hooks/useAppt";
import { ErrorCode } from "@business/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";
import { formatDateToDayKey } from "@/shared/utils/time-utils";
import type { DateKey, PublicAvailabilityState } from "@business/shared/types";
import styles from "./appt-manager.module.css";

type ApptManagerProps = {
  appt: ReturnType<typeof useAppointments>;
  availability: PublicAvailabilityState;
};

const ApptManagerContent = ({ appt, availability }: ApptManagerProps) => {
  // 1. El Hook maneja la data
  const { appts, addBlock, deleteItem } = appt;
  const { schedule } = availability; //es para mostrar el bloque de atención del día

  // 2. Estados de UI
  const [daySelected, setDaySelected] = useState<DateKey>(
    formatDateToKey(new Date()),
  );
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //TRADUCCIÓN: De "2026-03-23" pasamos a "L"
  const dayKey = formatDateToDayKey(daySelected);

  const handleOpenBanModal = () => {
    setIsBanModalOpen(true);
  };

  const handleCloseBanModal = () => {
    setIsBanModalOpen(false);
    setErrorMsg(null);
  };

  function handleDaySelect(day: DateKey) {
    setDaySelected(day);
  }

  const handleConfirmBlock = (formData: BanFormData): boolean => {
    // 1. Limpiamos cualquier rastro de error previo
    setErrorMsg(null);

    const result = addBlock(formData);

    // 2. Si falló, armamos el mensaje antes de salir
    if (!result.success && result.error) {
      const code = result.error.code as ErrorCode;
      const baseMsg = ERROR_MESSAGES[code] || "Error inesperado";
      const detail = result.error.message;

      setErrorMsg(`${baseMsg} ${detail ? `(${detail})` : ""}`);
    }

    // 3. Devolvemos el booleano directamente
    return result.success;
  };

  const handleDelete = (id: string) => {
    deleteItem(daySelected, id);
  };

  return (
    <>
      <Calendar
        daySelected={daySelected}
        onSelect={handleDaySelect}
      ></Calendar>
      <div className={styles.apptWorkDaySection}>
        <div className={styles.apptWorkDayContainer}>
          <Title
            textTitle={formatDateToDisplay(daySelected)}
            textSubtitle={`${appts[daySelected]?.length || 0} turnos`}
          ></Title>
          <Button
            variant="danger"
            onClick={handleOpenBanModal}
          >
            <Ban size={18} /> <span>Bloquear</span>
          </Button>
        </div>
        <div className={styles.apptListWorkBlockContainer}>
          <ApptWorkBlock
            title="Horario de atención hoy"
            subtitle={
              schedule?.[dayKey]?.isWorking
                ? "Configurado en Modalidad"
                : "Día no laboral"
            }
            icon={Briefcase}
            intervals={schedule?.[dayKey]?.intervals || []}
            isWorking={schedule?.[dayKey]?.isWorking || false}
          />
          <ApptList appts={appts[daySelected] || []} onDelete={handleDelete} />
        </div>

        {isBanModalOpen && (
          <ApptBanModal
            daySelected={daySelected}
            errorConfirmBlock={errorMsg}
            onClose={handleCloseBanModal}
            onConfirm={handleConfirmBlock}
          />
        )}
      </div>
    </>
  );
};

export const ApptManager = (props: ApptManagerProps) => (
  <FeatureErrorBoundary featureName="Appointments">
    <Suspense fallback={<div>Cargando turnos...</div>}>
      <ApptManagerContent {...props} />
    </Suspense>
  </FeatureErrorBoundary>
);

