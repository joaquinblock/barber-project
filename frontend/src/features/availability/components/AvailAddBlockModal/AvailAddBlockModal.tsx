import { Modal, Button, Input } from "@/shared/components/ui";
import { useState } from "react";
import { Alert } from "@/shared/components/ui";
import { CircleAlert } from "lucide-react";
import type { HourString, TimeRangeRequest } from "@barber/shared/types";

type AvailAddBlockModalProps = {
  onClose: () => void;
  onConfirm: (timeRange: TimeRangeRequest) => Promise<boolean> | boolean;
  errorMessage?: string | null;
};

export const AvailAddBlockModal = ({
  onClose,
  onConfirm,
  errorMessage,
}: AvailAddBlockModalProps) => {
  const [localBlock, setLocalBlock] = useState<TimeRangeRequest>({
    startTime: "00:00" as HourString,
    endTime: "00:00" as HourString,
  });

  const handleConfirm = async () => {
    // onConfirm en el padre ya se encarga de cerrar si es exitoso
    await onConfirm(localBlock);
  };

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
        onClick={handleConfirm}
        disabled={!localBlock.startTime || !localBlock.endTime}
        variant="primary"
      >
        Confirmar
      </Button>
    </Modal>
  );
};
