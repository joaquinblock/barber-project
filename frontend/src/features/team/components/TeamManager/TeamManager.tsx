import { Title } from "@/shared/components/ui";
import { TeamCard } from "../TeamCard/TeamCard";
import { Panel } from "@/shared/components/ui";
import { Scissors } from "lucide-react";

export const TeamManager = () => {
    return (
        <>
            <Title textTitle="Equipo" textSubtitle="Gestiona a tus empleados"  />
            <TeamCard />
        </>
    );
};