import { Card } from '@/shared/components/ui';
import { Clock, User } from 'lucide-react';
import styles from './appt-card.module.css';

type ApptCardProps = {
  time: string;
  customerName: string;
  serviceName: string;
};

export const ApptCard = ({ time, customerName, serviceName }: ApptCardProps) => {
  return (
    <Card variant="indicated">
      <div className={styles.apptContent}>
        {/* Sección Izquierda: Hora */}
        <div className={styles.timeSection}>
          <Clock size={18} className={styles.iconClock} />
          <span className={styles.timeText}>{time}</span>
        </div>

        {/* Sección Derecha: Info Cliente y Servicio */}
        <div className={styles.infoSection}>
          <div className={ styles.customerSection}>
            <User size={16} className={styles.iconUser} />
            <span className={styles.customerName}>{customerName}</span>
          </div>
          <div className={styles.serviceInfo}>
            <span className={styles.serviceName}>{serviceName}</span>
          </div>
        </div>

      </div>
    </Card>
  );
};