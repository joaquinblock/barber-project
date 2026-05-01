import { useState } from "react";
import type { Offers } from "@/shared/types";

export function useOffer(initial: Offers[] = []) {
  const [services, setServices] = useState<Offers[]>(initial);

  const updateService = (service: Offers) => {
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, ...service } : s))
    );
  };

  return {
    services,
    setServices,
    updateService,
  };
}
