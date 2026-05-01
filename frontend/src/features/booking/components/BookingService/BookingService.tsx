import type { Service } from "@/shared/types";
import styles from "./booking-service.module.css";
import { List } from "@/shared/components/ui/List/List";
import { Card } from "@/shared/components/ui/Card/Card";
import { formatPrice } from "@/shared/utils/price-utils";

type BookingServiceProps = {
  services: Service[];
  selectedService?: Service | null;
  onSelectService: (service: Service) => void;
};
export const BookingService = ({ services, selectedService, onSelectService }: BookingServiceProps) => {
  return (
    <div className={styles.serviceLayout}>
      <List
        items={services}
        renderItem={(service) => (
          <Card variant="selectable" onClick={() => onSelectService(service)} key={service.id} isActive={selectedService?.id === service.id}>
            <div className={styles.cardContent}>
              <div className={styles.cardTitleDuration}>
                <p className={styles.cardTitle}>{service.title}</p>
                <p className={styles.cardDuration}> 60 minutos</p>
              </div>
              <div className={styles.cardPriceContainer}>
                <p className={styles.cardPrice}>{formatPrice(service.price)}</p>
              </div>
            </div>
          </Card>
        )}
        emptyComponent={<p>No hay servicios disponibles</p>}
      />
    </div>
  );
};
