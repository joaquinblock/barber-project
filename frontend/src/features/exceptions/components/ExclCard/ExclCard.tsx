import { Button, Card } from "@/shared/components/ui";
import type { Exception } from "@/shared/types";
import styles from "./excl-card.module.css"
import { Trash2 } from "lucide-react";
type ExclCardProps = {
    exception: Exception
    onDelete: (id: string) => void;
}
export const ExclCard = ({ exception, onDelete }: ExclCardProps) => {
    return (
        <Card variant="selectable">
            <div className={styles.exclCardContent}>
                <div className={styles.exclLine}></div>
                <div className={styles.exclInfo}>
                    {exception.type === "full_day" ? (
                        <>
                            <h4 className={styles.exclDate}>{exception.startDate}</h4>
                            <p className={styles.exclReason}>{exception.reason}</p>
                        </>
                    ) : (
                        <>
                            <h4 className={styles.exclDate}>{exception.startDate} - {exception.endDate}</h4>
                            <p className={styles.exclReason}>{exception.reason}</p>
                        </>
                    )}
                </div>
                <Button size="sm" variant="trash" onClick={() => onDelete(exception.id)}><Trash2 size={18} /></Button>
            </div>
        </Card>
    );
}