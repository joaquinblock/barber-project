import { NavBar, NavItem } from "../../ui";
import { Calendar, Settings2} from "lucide-react";

export const EmployeeNavBar = () => {
    return (
        <NavBar>
            <NavItem spanText="Agenda" icon={Calendar} to="schedule" />
            <NavItem spanText="Modalidad" icon={Settings2} to="barber-config" />
        </NavBar>
    );
}