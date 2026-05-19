import styles from "./excl-modal.module.css";
import { ExclButtonBox } from "../ExclButtonBox/ExclButtonBox";
import { useState } from "react";
import { Button, Input } from "@/shared/components/ui";
import { Calendar as IconCalendar } from "lucide-react";
import { ExclCalendar} from "../ExclCalendar/ExclCalendar";
import { formatDateToKey, validateBasicTimeRange } from "@/shared/utils/time-utils";
import type { CreateExceptionDTO, CreateFullDayDTO, CreateRangeDTO, DateKey, ExceptionType, DateRange as SharedDateRange } from "@business/shared";
import type { DateRange } from "react-day-picker";

type ExclModalProps = {
  onSave: (data: CreateExceptionDTO) => void;
  isLoading?: boolean;
};

export const ExclModal = ({ onSave, isLoading }: ExclModalProps) => {
  const [type, setType] = useState<ExceptionType>("full-day");
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDay] = useState<Date | DateRange | undefined >(undefined);
  const [error, setError] = useState<string | null>(null);
  
  const handleSelectedDayChange = (day: Date | DateRange | undefined) => {
    setSelectedDay(day);
  };

  const handleTabChange = (selectedType: ExceptionType) => {
    setType(selectedType);
    setSelectedDay(undefined); 
    setError(null);
    setReason("");
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let data = {} as CreateExceptionDTO
     
    if (type === "full-day") {
      data = {
        type,
        reason: reason || "Sin motivo",
        startDate: formatDateToKey(selectedDate as Date),
      } as CreateFullDayDTO
    } else {
      data = {
        type,
        reason: reason || "Sin motivo",
        startDate: formatDateToKey((selectedDate as DateRange).from as Date),
        endDate: formatDateToKey((selectedDate as DateRange).to as Date),
      } as CreateRangeDTO
    }

    onSave(data);
  };

  return (
    <form className={styles.exclModalContainer} onSubmit={handleSave}>
      <ExclButtonBox
        selectedType={type}
        onSelect={handleTabChange}
      ></ExclButtonBox>
      <Input
        label="Motivo"
        placeholder="Ej: Cumpleaños, Vacaciones ..."
        value={reason}
        onChange={handleReasonChange}
      ></Input>
      <div className={styles.calendarSection}>
        <IconCalendar />
        <span className={styles.exclLabel}>Fecha</span>
        {type === "full-day" ? (
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
          selectedDay={selectedDate}
          onSelect={handleSelectedDayChange}
        ></ExclCalendar>
        <Button
          variant="primary"
          type="submit"
          disabled={
            type === "range" 
              ? !(selectedDate as DateRange)?.from || !(selectedDate as DateRange)?.to || (selectedDate as DateRange)?.from === (selectedDate as DateRange)?.to 
              : !selectedDate
          }
        >
          Guardar
        </Button>
      </div>
    </form>
  );
};
