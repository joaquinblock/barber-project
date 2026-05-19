import type { UserResponseDTO } from "./user.types";

export type AuthResponseDTO = {
  user: UserResponseDTO;
  businessId: string;
};

export type LoginResponseDTO = AuthResponseDTO & {
  token: string;
};