import { ApptManager as AppointmentManager } from "@/features/appointments";
import { useAppointments } from "@/features/appointments/hooks/useAppt";
import { barberConfigMock } from "@/shared/constants/barber-config.mock-data";

export const SchedulePage = () => {

    //const appt = useAppointments(INITIAL_APPT);

    return (
        // <AppointmentManager
        //     appt={appt}
        //     availability={barberConfig.availability}
        // />
        <div className="flex h-full flex-col bg-background">
            <h1>Horario</h1>
        </div>
    );
};