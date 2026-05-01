import styles from "./excl-modal.module.css";
import { ExclButtonBox } from "../ExclButtonBox/ExclButtonBox";
import { useState } from "react";
import type { DateKey, Exception } from "@/shared/types";
import { Button, Input } from "@/shared/components/ui";
import { Calendar as IconCalendar } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { ExclCalendar} from "../ExclCalendar/ExclCalendar";
import { formatDateToKey } from "@/shared/utils/time-utils";
type ExclModalProps = {
  onSave: (exception: Exception) => void;
};
export const ExclModal = ({ onSave}: ExclModalProps) => {
  const [type, setType] = useState<Exception["type"]>("full_day");
  const [reason, setReason] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | DateRange>();

  const handleSelectedDayChange = (day: Date | DateRange) => {
    console.log(day);
    setSelectedDay(day);
  };

  const handleTabChange = (selectedType: Exception["type"]) => {
    setType(selectedType);
    setSelectedDay(undefined); // Reseteamos la selección de fecha al cambiar de tipo
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const handleSave = () => {
    if (!reason || !selectedDay) {
      alert("Por favor completa todos los campos");
      return;
    }

    // 1. Extraemos las fechas reales según el tipo de selección
    const start =
      type === "full_day"
        ? (selectedDay as Date)
        : (selectedDay as DateRange)?.from;

    const end =
      type === "full_day"
        ? (selectedDay as Date)
        : (selectedDay as DateRange)?.to;

    // 2. La "Guarda": Si no hay fecha de inicio, no podemos guardar.
    if (!start) return;

    // 3. Ahora sí, TypeScript sabe que 'start' NO es undefined aquí
    onSave({
      id: crypto.randomUUID(),
      type,
      reason,
      startDate: formatDateToKey(start) as DateKey,
      endDate: formatDateToKey(end || start) as DateKey,
    });
  };
  return (
    <div className={styles.exclModalContainer}>
      <ExclButtonBox
        selectedType={type}
        onSelect={handleTabChange}
      ></ExclButtonBox>
      <Input
        label="Motivo"
        placeholder="Ej: Vacaciones, Semana Santa ..."
        value={reason}
        onChange={handleReasonChange}
      ></Input>
      <div className={styles.calendarSection}>
        <IconCalendar />
        <span className={styles.exclLabel}>Fecha</span>
        {type === "full_day" ? (
          <span className={styles.exclSubLabel}>
            Selecciona un día específico
          </span>
        ) : (
          <span className={styles.exclSubLabel}>
            Selecciona un rango de fechas
          </span>
        )}

        <ExclCalendar
          type={type}
          selectedDay={selectedDay}
          onSelect={handleSelectedDayChange}
        ></ExclCalendar>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};
