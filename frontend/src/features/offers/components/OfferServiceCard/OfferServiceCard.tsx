import { Switch, Card } from "@/shared/components/ui";
import { useState } from "react";
import styles from "./offer-service-card.module.css";
import type { Service } from "@/shared/types";

type ServiceCardProps = {
  service: Service;
};

export const OfferServiceCard = ({ service }: ServiceCardProps) => {
  const [isActive, setIsActive] = useState(false);

  function handleSwitchChange(checked: boolean) {
    setIsActive(checked);
  }

  const classesTitle = isActive
    ? `${styles.cardTitle} ${styles.active}`
    : styles.cardTitle;

  return (
    <>
      <Card variant="selectable" isActive={isActive}>
        <div className={styles.textInfo}>
          <span className={classesTitle}>{service.title}</span>
          <span className={styles.cardPrice}>{service.price}</span>
        </div>
        <Switch checked={isActive} onChange={handleSwitchChange} />
      </Card>
    </>
  );
};
