import { List, Panel, Title } from "@/shared/components/ui";
import { useOffer } from "@/features/offers/hooks/useOffer";
import { OfferServiceCard } from "../OfferServiceCard/OfferServiceCard";
import { Scissors } from "lucide-react";
import styles from "./offer-manager.module.css";
type OfferManagerProps = {
  offers: ReturnType<typeof useOffer>;
};
export const OfferManager = ({ offers }: OfferManagerProps) => {
  const { services, setServices, updateService } = offers;
  
  return (
    <Panel title="Mis servicios" subtitle="Selecciona que realizas y personaliza tus precios si es necesario" icon={Scissors}>
      <List
        items={services}
        renderItem={(service) => (
          <OfferServiceCard key={service.id} service={service} />
        )}
        emptyComponent={<span>No hay servicios configurados</span>}
      />
    </Panel>
  );
};
