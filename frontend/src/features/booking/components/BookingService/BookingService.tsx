import styles from "./booking-service.module.css";
import { List } from "@/shared/components/ui/List/List";
import { Card } from "@/shared/components/ui/Card/Card";
import { formatPrice } from "@/shared/utils/price-utils";
import type { OfferResponseDTO } from "@business/shared/types";

type BookingServiceProps = {
  offers: OfferResponseDTO[];
  selectedOffer?: OfferResponseDTO | null;
  onSelectOffer: (offer: OfferResponseDTO) => void;
};
export const BookingService = ({ offers, selectedOffer, onSelectOffer }: BookingServiceProps) => {
  return (
    <div className={styles.serviceLayout}>
      <List     
        items={offers}
        renderItem={(offer) => (
          <div key={offer.id}>
            <Card variant="selectable" onClick={() => onSelectOffer(offer)} key={offer.id} isActive={selectedOffer?.id === offer.id}>
            <div className={styles.cardContent}>
              <div className={styles.cardTitleDuration}>
                <p className={styles.cardTitle}>{offer.title}</p>
                <p className={styles.cardDuration}> {offer.duration} minutos</p>
              </div>
              <div className={styles.cardPriceContainer}>
                <p className={styles.cardPrice}>{formatPrice(offer.price)}</p>
              </div>
            </div>
          </Card>
          </div>
        )}
        emptyComponent={<p>No hay servicios disponibles</p>}
      />
    </div>
  );
};
