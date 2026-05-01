import type { LucideIcon } from "lucide-react";
import styles from './empty-state.module.css'

type EmptyStateProps = {
    text: string;
    icon?: LucideIcon; 
};

export const EmptyState = ({ text, icon: Icon }: EmptyStateProps) => {
    return (
        <div className={styles.emptyStateContainer}>
            {Icon && <Icon size={40} className={styles.emptyStateIcon} />}
            <p className={styles.emptyStateText}>{text}</p>
        </div>
    );
};