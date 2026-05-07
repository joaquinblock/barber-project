import { api } from "../utils/api.wrapper";
import type { LoginCredentials } from "../types";
import type { LoginResponseDTO } from "@barber/shared/types";

export const AuthService = {
  /**
   * Realiza la petición de login al backend.
   * El backend recibirá email, password y slug.
   */
  login: async ({ email, password }: LoginCredentials, slug: string): Promise<LoginResponseDTO> => {
    // El wrapper 'api' ya maneja:
    // - Base URL
    // - Headers (Content-Type: application/json)
    // - JSON stringify del body
    // - Error handling (lanzando HttpError si success: false o !ok)
    // - Unwrapping del body.data
    return api.post<LoginResponseDTO>("/auth/login", { email, password, slug });
  },

  /**
   * Valida el token actual y obtiene el perfil del usuario.
   */
  getProfile: async (token: string): Promise<any> => {
    return api.post<any>("/auth/profile", { token });
  }
};
