export type BarbershopDTO = {
  name: string;
  slug: string;
  photoUrl: string | null;
  address: string | null;
  phone: string | null;
  isActive: boolean;
};

export type BarbershopResponseDTO = BarbershopDTO & {
  id: string;
};
