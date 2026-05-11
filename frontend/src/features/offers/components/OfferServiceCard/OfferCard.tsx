import { Switch, Card, Button } from "@/shared/components/ui";
import { useState } from "react";
import styles from "./offer-card.module.css";
import type { OfferResponseDTO } from "@barber/shared/types";
import { Clock, DollarSign, Pen,Trash2 } from "lucide-react";

type ServiceCardProps = {
  service: OfferResponseDTO;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
};

export const OfferServiceCard = ({ service, onEdit, onDelete, onToggleActive }: ServiceCardProps) => {
  const [isActive, setIsActive] = useState(service.isActive);

  function handleSwitchChange(checked: boolean) {
    setIsActive(checked);
    onToggleActive(service.id, checked);
  }

  const classesTitle = isActive
    ? `${styles.cardTitle} ${styles.active}`
    : styles.cardTitle;

  return (
    <>
      <Card variant="selectable" isActive={isActive}>
          <div className={styles.textInfo}>
            <span className={classesTitle}>{service.title}</span>
            <div className={styles.subtitle}>
              <span className={styles.cardPrice}><DollarSign size={12}></DollarSign> {service.price}</span>
              <span className={styles.dot}> • </span>
              <span className={styles.cardTime}><Clock size={12}></Clock> {service.duration}</span>
            </div>
          </div>
          <div className={styles.buttonBox}>
            <Switch checked={isActive} onChange={handleSwitchChange} />
            <div className={styles.buttonsContainer}>
              <Button variant="secondary" size="md" onClick={() => onEdit(service.id)}>
                <Pen size={16}/>
              </Button>
              <Button variant="danger" size="md" onClick={() => onDelete(service.id)}>
                <Trash2 size={16}/>
              </Button>
            </div>
          </div>
      </Card>
    </>
  );
};
