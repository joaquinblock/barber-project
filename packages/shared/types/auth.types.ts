import type { User } from "./user.types";

export type LoginResponseDTO = {
  user: User;
  token: string;
  barbershopId: string; // El contexto de la sesión actual
};