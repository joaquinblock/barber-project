import { ApptCard, ApptBlockedCard } from "@/features/appointments";
import { List, EmptyState } from "@/shared/components/ui";
import { Calendar } from "lucide-react";
import type { Appt } from "@/shared/types";

type ApptListProps = {
  appts: Appt[];
  onDelete: (id: string) => void;
};

export const ApptList = ({ appts, onDelete }: ApptListProps) => {
  return (
    <List 
      items={appts}
      emptyComponent= {<EmptyState text="No hay turnos para este día" icon={Calendar} />}
      renderItem={(appt) => (
        appt.type === 'blocked' 
          ? <ApptBlockedCard 
              key={appt.id} 
              time={appt.startTime}
              reason={appt.reason} 
              onDelete={() => onDelete(appt.id)} 
            />
          : <ApptCard 
              key={appt.id} 
              time={appt.startTime} 
              customerName={appt.customer.name} 
              serviceName={appt.service.title} 
            />
      )}
    />
  );
};