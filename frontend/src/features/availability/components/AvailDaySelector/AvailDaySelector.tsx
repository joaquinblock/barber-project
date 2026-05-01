import type { DayKey } from '@/shared/types';
import type { WeeklyAvailability } from '@/shared/types';
import styles from './avail-day-selector.module.css';
import { DayButton } from '@/shared/components/ui';


type DaySelectorProps = {
  selectedDay?: DayKey; // 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D'
  schedule: WeeklyAvailability; //Record<string, DayConfig>
  onSelectDay: (day: DayKey) => void;
};

export const AvailDaySelector = ({selectedDay = 'L',schedule, onSelectDay  }: DaySelectorProps) => {
  // Obtenemos los días dinámicamente de las llaves del objeto
  const days = Object.keys(schedule) as DayKey[];

  return (
    <div className={styles.daySelector}>
        {days.map((day) => (
            <DayButton
                key={day}
                text={day}
                active={day === selectedDay}
                hasWork={schedule[day].isWorking}
                onClick={() => onSelectDay(day)}
            />
        ))}
    </div>
  );
};