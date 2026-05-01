import { Button, Input} from "@/shared/components/ui";
import { Trash2} from "lucide-react";
import styles from "./avail-work-block.module.css";

type AvailWorkBlockProps = {
    startTime: string;
    endTime: string;
    isEditable?: boolean;
    onDelete: () => void;
    onStartChange?: (val: string) => void; // Para guardar datos
    onEndChange?: (val: string) => void;
    showSeparator?: boolean;
};
export const AvailWorkBlock = ({ startTime, endTime, isEditable = false, onDelete, onStartChange, onEndChange, showSeparator = true }: AvailWorkBlockProps) => {
    return (
        <div className={styles.availWorkBlock}>
            <Input 
                type="time" 
                variant="inline" 
                label="Desde" 
                value={startTime} 
                readOnly={!isEditable} //si No es editable, el input es de solo lectura
                onChange={(e) => onStartChange && onStartChange(e.target.value)}
            />
            {showSeparator && (
                <span className={styles.availWorkBlockSeparator}>-</span>
            )}
            <Input 
                type="time" 
                variant="inline" 
                label="Hasta" 
                value={endTime}
                readOnly={!isEditable}
                onChange={(e) => onEndChange && onEndChange(e.target.value)}
            />
            <Button size="sm" variant="trash" onClick={onDelete}><Trash2 size={18}/></Button>
        </div>
    );
}