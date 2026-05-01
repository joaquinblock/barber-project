import type { User } from "@barber/shared/types";

//La password no se incluye en el User por seguridad, pero se necesita para el login, por eso se define esta interfaz específica para las credenciales de login.
export type LoginCredentials = Pick<User, 'email'> & {
  password: string;
}

export type RegisterCredentials = Pick<User, 'email' | 'fullName'> & {
  password: string;
  confirmPassword: string; // Validación de UI
};