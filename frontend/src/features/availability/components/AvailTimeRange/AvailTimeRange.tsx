import { Button, List } from "@/shared/components/ui";
import { AvailWorkBlock } from "@/features/availability";
import { Plus } from "lucide-react";
import type { TimeInterval } from "@/shared/types";
import styles from "./avail-time-range.module.css";

type AvailTimeRangeProps = {
    items: TimeInterval[];
    onClickAddBlock?: () => void;
    onDelete?: (id: string) => void;
};

export const AvailTimeRange = ({ items, onClickAddBlock, onDelete }: AvailTimeRangeProps) => {
    return (
        <div className={styles.availTimeRangeContainer}>
            <List 
                items={items}
                emptyComponent={null}
                renderItem={(item) => (
                    <AvailWorkBlock
                        key={item.id}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        isEditable={false}
                        onDelete={() => onDelete && onDelete(item.id)}
                    />
                )}
            />
            <Button variant="primary" onClick={onClickAddBlock}> <Plus size={18} /> Add Time Interval</Button>
        </div>
    );
}