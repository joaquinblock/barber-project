import { api } from "../../api/utils/api.wrapper";
import type { LoginCredentials } from "../types";
import type { LoginResponseDTO, AuthResponseDTO } from "@business/shared/types";

export class AuthService {
  /**
   * Realiza la petición de login al backend.
   * El backend recibirá email, password y slug.
   */
  static async login({ email, password }: LoginCredentials, slug: string): Promise<LoginResponseDTO> {
    return api.post<LoginResponseDTO>("/auth/login", { email, password, slug });
  }

  /**
   * Valida el token actual y obtiene el perfil del usuario.
   */
  static async getProfile(token: string): Promise<AuthResponseDTO> {
    return api.post<AuthResponseDTO>("/auth/profile", { token });
  }
}
