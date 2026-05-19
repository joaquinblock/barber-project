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
  professionalId: string;
  businessId: string;
};

export type UpdateOfferDTO = Partial<CreateOfferDTO>;