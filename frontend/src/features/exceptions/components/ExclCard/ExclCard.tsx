import { Button, Card } from "@/shared/components/ui";
import type { ExceptionResponseDTO } from "@business/shared/types";
import { formatExceptionDisplayDate } from "@/shared/utils/time-utils";
import styles from "./excl-card.module.css"
import { Trash2 } from "lucide-react";
type ExclCardProps = {
    exception: ExceptionResponseDTO
    onDelete: (id: string) => void;
}
export const ExclCard = ({ exception, onDelete }: ExclCardProps) => {
    return (
        <Card variant="selectable">
            <div className={styles.exclCardContent}>
                <div className={styles.exclLine}></div>
                <div className={styles.exclInfo}>
                    {exception.type === "full-day" ? (
                        <>
                            <h4 className={styles.exclDate}>{formatExceptionDisplayDate(exception.startDate)}</h4>
                            <p className={styles.exclReason}>{exception.reason}</p>
                        </>
                    ) : (
                        <>
                            <h4 className={styles.exclDate}>{formatExceptionDisplayDate(exception.startDate, exception.endDate)}</h4>
                            <p className={styles.exclReason}>{exception.reason}</p>
                        </>
                    )}
                </div>
                <Button size="sm" variant="trash" onClick={() => onDelete(exception.id)}><Trash2 size={18} /></Button>
            </div>
        </Card>
    );
}