export type CreateCustomerDTO = {
  birthDate: Date | null;
  loyaltyPoints: number | null;
};

export type ResponseCustomerDTO = {
  id: string;
  birthDate: Date | null;
  loyaltyPoints: number | null;
  createdAt: string;
  updatedAt: string;
};
