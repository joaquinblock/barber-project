import styles from "./booking-date.module.css";
import type {
  Exception,
} from "@/shared/types/barber-config";
import { Calendar } from "@/shared/components/ui";
import { BOOKING_MESSAGES } from "../../constants/booking.message";
import type { DateKey } from "@/shared/types";
type BookingDateProps = {
  daySelected: DateKey;
  exceptionForSelectedDay?: Exception;
  isDayBlocked?: boolean;
  isWorking?: boolean;
  onSelect: (day: DateKey) => void;
};
export const BookingDate = ({ daySelected, isDayBlocked, isWorking, exceptionForSelectedDay, onSelect }: BookingDateProps) => {
 
    let dayMessage = "";

    if (!isDayBlocked) {
        dayMessage = BOOKING_MESSAGES.available;
    } 

    if (isDayBlocked) {
        dayMessage = BOOKING_MESSAGES.exception(exceptionForSelectedDay?.reason ?? "Sin razón especificada");
    }

    if(!isDayBlocked && !isWorking) {
        dayMessage = BOOKING_MESSAGES.notWorking;
    }

    return (
        <div className={styles.dateLayout}>
            <Calendar 
                daySelected={daySelected} 
                onSelect={onSelect}>
            </Calendar>
            <h3>Selected Date: {daySelected}</h3>
            <p>{dayMessage}</p>
            {}
        </div>
    );
};
