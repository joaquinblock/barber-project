import { List, Panel, FeatureErrorBoundary } from "@/shared/components/ui";
import { useOffer } from "@/features/offers/hooks/useOffer";
import { OfferServiceCard } from "../OfferServiceCard/OfferServiceCard";
import { Scissors } from "lucide-react";
import styles from "./offer-manager.module.css";
import { Suspense } from "react";

type OfferManagerProps = {
  offers: ReturnType<typeof useOffer>;
};

const OfferManagerContent = ({ offers }: OfferManagerProps) => {
  const { services } = offers;
  
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

export const OfferManager = (props: OfferManagerProps) => (
  <FeatureErrorBoundary featureName="Offers">
    <Suspense fallback={<div>Cargando servicios...</div>}>
      <OfferManagerContent {...props} />
    </Suspense>
  </FeatureErrorBoundary>
);

