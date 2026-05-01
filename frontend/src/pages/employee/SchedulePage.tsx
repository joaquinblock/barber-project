import { ApptManager as AppointmentManager } from "@/features/appointments";
import { useBarberConfig } from "@/shared/hooks/useBarberConfig";
import { useAppointments } from "@/features/appointments/hooks/useAppt";
import { barberConfigMock } from "@/shared/constants/barber-config.mock-data";

export const SchedulePage = () => {

    const barberConfig = useBarberConfig(barberConfigMock);
    const appt = useAppointments(INITIAL_APPT);

    return (
        <AppointmentManager
            appt={appt}
            availability={barberConfig.availability}
        />
    );
};