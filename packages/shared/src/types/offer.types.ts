export type CreateOfferDTO = {
  title: string;
  description: string | null;
  price: number;
  duration: number; // minutes
};

export type OfferResponseDTO = CreateOfferDTO & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  barberId: string;
  barbershopId: string;
};

export type UpdateOfferDTO = Partial<CreateOfferDTO>;
