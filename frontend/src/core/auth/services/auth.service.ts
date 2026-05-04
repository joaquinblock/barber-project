import type { LoginCredentials} from "../types";
import { AuthError } from "../errors/auth.error";
import type { LoginResponseDTO } from "@barber/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

export const AuthService = {
  /**
   * Realiza la petición de login al backend.
   * El backend recibirá email, password y slug.
   */
  login: async ({ email, password }: LoginCredentials, slug: string): Promise<LoginResponseDTO> => {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, slug }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        response.status,
        data.error.code || 'AUTH_NETWORK_ERROR', 
        data.error.message || 'Error en la autenticación'
      );
    }

    return data.data;
  },

  /**
   * Valida el token actual y obtiene el perfil del usuario.
   */
  getProfile: async (token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        response.status,
        data.error?.code || 'AUTH_ERROR', 
        data.error?.message || 'Error al validar la sesión'
      );
    }

    return data.data;
  }
};
