import { useAuth } from "@/core/auth/hooks/useAuth";
import { NavBar, NavItem } from "../../ui";
import { Calendar, Settings2, Users } from "lucide-react";



export const BusinessNavBar = () => {
    const { isAdmin, isProfessional, isAdminProfessional} = useAuth();

    return (
        <NavBar>
            {isAdminProfessional && (
                <>
                    <NavItem spanText="Agenda" icon={Calendar} to="schedule" />
                    <NavItem spanText="Modalidad" icon={Settings2} to="barber-config" />
                    <NavItem spanText="Equipo" icon={Users} to="team" />
                </>
            )}
            
            {isProfessional && (
                <>
                    <NavItem spanText="Agenda" icon={Calendar} to="schedule" />
                    <NavItem spanText="Modalidad" icon={Settings2} to="barber-config" />
                </>
            )}

            {isAdmin && (
                <NavItem spanText="Equipo" icon={Users} to="team" />
            )}
        </NavBar>
    );
}