import { List, Panel, FeatureErrorBoundary } from "@/shared/components/ui";
import { useGetOffers, useCreateOffer, useUpdateOffer, useDeleteOffer  } from "@/features/offers/hooks/useOffer";
import { OfferServiceCard } from "../OfferServiceCard/OfferServiceCard";
import { Scissors } from "lucide-react";
import styles from "./offer-manager.module.css";
import { Suspense } from "react";


const OfferManagerContent = () => {
  const {offers} = useGetOffers();
  
  return (
    <Panel title="Mis servicios" subtitle="Selecciona que realizas y personaliza tus precios si es necesario" icon={Scissors}>
      <List
        items={offers}
        renderItem={(service) => (
          <OfferServiceCard key={service.id} service={service} />
        )}
        emptyComponent={<span>No hay servicios configurados</span>}
      />
    </Panel>
  );
};

export const OfferManager = () => (
  <FeatureErrorBoundary featureName="Offers">
    <Suspense fallback={<div>Cargando servicios...</div>}>
      <OfferManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);

