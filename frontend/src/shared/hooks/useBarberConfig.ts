
import { useExcl } from "@/features/exclusions/hooks/useExcl";
import type { BarberConfig} from "@/shared/types";
import { useOffer } from "@/features/offers/hooks/useOffer";

export const useBarberConfig = (initial: BarberConfig) => {
  const offers = useOffer(initial.offers);
  const exceptions = useExcl(initial.exceptions);

  return {
    barberId: initial.barberId,
    offers,          // expone todo lo de useOffer
    exceptions,     // expone todo lo de useExcl
  };
};