import { DayPicker, type DateRange } from "react-day-picker";
import "./excl-calendar.css";
import { es } from "date-fns/locale";
import type { ExceptionType} from "@business/shared";

type ExclCalendarProps = {
  type: ExceptionType;
  selectedDay: Date | DateRange | undefined;
  onSelect?: (day: Date | DateRange | undefined) => void;
};

export const ExclCalendar = ({
  type,
  selectedDay,
  onSelect,
}: ExclCalendarProps) => {
  if (type === "full-day") {
    return (
      <DayPicker
        key="single-picker"
        mode="single"
        selected={selectedDay as Date}
        onSelect={onSelect}
        required
        locale={es}
      />
    );
  }

  // Si no es full_day, cae acá por descarte
  return (
    <DayPicker
      key="range-picker"
      mode="range"
      selected={selectedDay as DateRange}
      onSelect={onSelect}
      required
      locale={es}
      modifiersStyles={{
        range_middle: {
          backgroundColor: "#f3f4f6",
          color: "#111827",
          borderRadius: "0px",
        },
        range_start: {
          backgroundColor: "#f3f4f6",
        },
        range_end: {
          backgroundColor: "#f3f4f6",
        },
      }}
    />
  );
};
