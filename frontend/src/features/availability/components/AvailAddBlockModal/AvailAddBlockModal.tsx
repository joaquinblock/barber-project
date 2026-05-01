import { Modal, Button, Input } from "@/shared/components/ui";
import { useState } from "react";
import { Alert } from "@/shared/components/ui";
import { CircleAlert } from "lucide-react";
import type { TimeRange, HourString } from "@/shared/types";

type AvailAddBlockModalProps = {
  onClose: () => void;
  onConfirm: (timeRange: TimeRange) => boolean;
  errorMessage?: string | null;
};

export const AvailAddBlockModal = ({
  onClose,
  onConfirm,
  errorMessage,
}: AvailAddBlockModalProps) => {
  const [localBlock, setLocalBlock] = useState<TimeRange>({
    startTime: "00:00" as HourString,
    endTime: "00:00" as HourString,
  });

  return (
    <Modal text="Agregar bloque de trabajo" onClose={onClose}>
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
        <Alert variant="error" iconLeft={CircleAlert}>
          {errorMessage}
        </Alert>
      )}
      <Button 
        onClick={() => onConfirm(localBlock) && onClose()}
        disabled={!localBlock.startTime || !localBlock.endTime}
        variant="primary"
      >
        Confirmar
      </Button>
    </Modal>
  );
};
