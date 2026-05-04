export type OfferDTO = {
  title: string;
  description: string | null;
  price: number;
  duration: number; // minutes
  isActive: boolean;
  barberId: string;
  barbershopId: string;
};

export type OfferResponseDTO = OfferDTO & {
  id: string;
};
