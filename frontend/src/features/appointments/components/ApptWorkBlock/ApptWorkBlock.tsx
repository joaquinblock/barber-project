import styles from './appt-work-block.module.css';
import type { LucideIcon } from 'lucide-react';
import type { TimeInterval } from '@/shared/types'; 

type ApptWorkBlockProps = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    intervals: TimeInterval[]; 
    isWorking: boolean;       // <-- Para saber si mostrar el horario o "Cerrado"
};

export const ApptWorkBlock = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    intervals, 
    isWorking 
}: ApptWorkBlockProps) => {
  return (
    <div className={styles.apptWorkBlockContainer}>
        {Icon && <Icon size={16} className={styles.apptWorkBlockIcon}/>}
        <div className={styles.apptWorkBlockTextContainer}>
            <p className={styles.apptWorkBlockTitle}>{title}</p>
            
            {/* LÓGICA DE RENDERIZADO REAL */}
            <div className={styles.apptWorkBlockTimesWrapper}>
                {isWorking && intervals.length > 0 ? (
                    intervals.map((interval) => (
                        <span key={interval.id} className={styles.apptWorkBlockTime}>
                            {interval.startTime} - {interval.endTime}
                        </span>
                    ))
                ) : (
                    <span className={styles.apptWorkBlockClosed}>Local Cerrado</span>
                )}
            </div>

            <p className={styles.apptWorkBlockSubtitle}>{subtitle}</p>
        </div>
    </div>
  );
};