import type { Barber } from "@/core/auth/types";
import styles from "./booking-barber.module.css"
type BookingBarberProps = {
    barber: Barber;
    onSelect: (barber: Barber) => void;
};
export const BookingBarber = ({ barber, onSelect }: BookingBarberProps) => {
    return (
        <div className={styles.barberLayout}>
            <h1>Booking Barber</h1>
            <p>{barber.name}</p>
            <button onClick={() => onSelect(barber)}>Select Barber</button>
        </div>
    );
}