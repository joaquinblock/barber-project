import { Button, Card } from "@/shared/components/ui";
import { Ban as BanIcon, Trash2 as TrashIcon } from "lucide-react";
import styles from "./appt-blocked-card.module.css";
import type { HourString } from "@/shared/types";

type ApptBlockedCardProps = {
  time: HourString;
  reason: string;
  onDelete: () => void;
};

export const ApptBlockedCard = ({ time, reason, onDelete }: ApptBlockedCardProps) => {
  return (
    <Card variant="striped">
       <div className={styles.blockedCardContent}>
        <div className={styles.iconTimeReasonContainer}>
            <div className={styles.iconContainer}>
             <BanIcon size={20} />
            </div>
            <div className={styles.timeReasonContainer}>
                <span className={styles.timeBadge}>{time}</span>
                <p className={styles.reasonText}>Bloqueado: {reason}</p>
            </div>
        </div>
          <Button variant="trash" onClick={onDelete}> <TrashIcon size={18} /> </Button>
       </div>
    </Card>
  );
};