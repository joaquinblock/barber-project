import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { parseISO } from "date-fns";
import 'react-day-picker/dist/style.css';
import './calendar.css'; 
import type { DateKey} from '@/shared/types';
import { formatDateToKey } from '@/shared/utils/time-utils';

type CalendarProps = {
  daySelected?: DateKey; // "2026-03-17" (formateado para el Manager)
  onSelect?: (day: DateKey ) => void; // El Manager recibe directamente la KEY
};
  
export const Calendar = ({ daySelected, onSelect }: CalendarProps) => {

  const handleSelect = (date: Date | undefined) => {
    if (date && onSelect) {
      const dateKey = formatDateToKey(date);
      onSelect(dateKey);
    }
  };

  return (
    <div className='calendar-container'>
      <DayPicker
        mode="single"
        selected={daySelected ? parseISO(daySelected) : undefined}
        onSelect={handleSelect}
        locale={es}
        required
      />
    </div>
  );
}