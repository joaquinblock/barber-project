import { Modal, Alert, Button, ErrorInline } from "@/shared/components/ui";
import { Ban, CircleAlert } from "lucide-react";
import { useState } from "react";
import { formatDateToDisplay} from "@/shared//utils/time-utils";
import type { BanFormData } from "@/features/appointments/types";
import { Input } from "@/shared/components/ui";
import type { DateKey, HourString } from "@/shared/types";

type ApptBanModalProps = {
  daySelected: DateKey; // "2026-03-17" (Viene del Manager ya formateado)
  errorConfirmBlock?: string | null; //el turno no se puedo bloquear por que...
  onClose: () => void;
  onConfirm: (data: BanFormData) => boolean;
};

export const ApptBanModal = ({
  daySelected,
  errorConfirmBlock,
  onClose,
  onConfirm,
}: ApptBanModalProps) => {
  const [banData, setBanData] = useState<BanFormData>({
    type: "blocked",
    date: daySelected,
    startTime: "00:00" as HourString,
    endTime: "00:00" as HourString,
    barber: {
      id: "", 
      name: "", 
    }, 
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirm(banData)) {
      onClose();
    }
  };

  return (
    <Modal variant="block" iconLeft={Ban} text="Bloquear horario" onClose={onClose}>
      <Alert
        variant="warning"
        day={formatDateToDisplay(daySelected)}
        iconLeft={CircleAlert}
      >
        Se bloquearán turnos para el día
      </Alert>

      {/* INPUTS DIRECTOS (Como en AvailModal) */}
      <form onSubmit={handleSubmit}>
      <Input
        type="time"
        label="Desde"
        onChange={(e) => setBanData(prev => ({ ...prev, startTime: e.target.value as HourString }))}
      />
      <Input
        type="time"
        label="Hasta"
        onChange={(e) => setBanData(prev => ({ ...prev, endTime: e.target.value as HourString }))}
      />
      <Input
        label="Motivo del bloqueo"
        placeholder="Ej: Almuerzo, Trámite médico..."
        onChange={(e) => setBanData(prev => ({ ...prev, reason: e.target.value }))}
      />

      {errorConfirmBlock && (
        <ErrorInline iconLeft={CircleAlert}>
          {errorConfirmBlock}
        </ErrorInline>
      )}

      <Button
        variant="block"
        type="submit"
        disabled={!banData.startTime || !banData.endTime || !banData.reason}
      >
        Confirmar Bloqueo
      </Button>
      </form>

    </Modal>
  );
};