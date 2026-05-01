import styles from "./avail-day-header.module.css";
import { Switch } from "@/shared/components/ui";
type AvailDayHeaderProps = {
    day: string; //esto es string porque es solo para mostrar el nombre del día, no para lógica, por eso no uso DayKey
    isWorking: boolean;
    onChange: (value: boolean) => void;
};

export const AvailDayHeader = ({ day, isWorking , onChange }: AvailDayHeaderProps) => {
    return (
        <div className={styles.availDayHeader}>
            <span className={styles.availDayHeaderSpan}>{day}</span>
            <Switch variant="ant" label={isWorking ? "Trabajo" : "Libre"} checked={isWorking} onChange={onChange}></Switch>
        </div>
    );
}