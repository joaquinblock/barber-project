import { DayPicker, type DateRange } from "react-day-picker";
import "./excl-calendar.css";
import { es } from "date-fns/locale";

type ExclCalendarProps = {
  type: "full_day" | "range";
  // En el puente (props) dejamos que vengan ambas
  selectedDay?: Date | DateRange;
  // Usamos 'any' en el onSelect del puente para no pelear con la firma estricta de la librería
  onSelect?: (day: any) => void;
};

export const ExclCalendar = ({
  type,
  selectedDay,
  onSelect,
}: ExclCalendarProps) => {
  if (type === "full_day") {
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
