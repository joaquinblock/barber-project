export type BusinessDTO = {
  name: string;
  slug: string;
  photoUrl: string | null;
  address: string | null;
  phone: string | null;
  isActive: boolean;
};

export type BusinessResponseDTO = BusinessDTO & {
  id: string;
};

export const BusinessType = {
  BARBERSHOP: 'barbershop', //barberia
  HAIRDRESSER: 'hairdresser', //peluqueria
  TATTOO: 'tattoo', //tatuajes
  BEAUTY_SALON: 'beauty_salon', //salón de belleza
  MEDICAL: 'medical', //médico
} as const;

export type BusinessType = typeof BusinessType[keyof typeof BusinessType];