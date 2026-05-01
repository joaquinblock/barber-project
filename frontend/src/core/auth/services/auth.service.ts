import type { AuthErrorCode, LoginCredentials} from "../types";
import type { OperationResult } from "@/shared/types";
import type { LoginResponseDTO } from "@barber/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_ENDPOINT = `${API_BASE_URL}/users/login`;

export const AuthService = {
  /**
   * Realiza la petición de login al backend.
   * El backend recibirá email, password y slug.
   */
  login: async ({ email, password }: LoginCredentials, slug: string): Promise<OperationResult<LoginResponseDTO, AuthErrorCode>> => {
     const response = await fetch(LOGIN_ENDPOINT, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ email, password, slug }), //convierte de JSON a string para enviar al backend
     });

     const data = await response.json();

     if (!response.ok) {
       return {
         success: false,
         error: {
           code: data.code || "AUTH_NETWORK_ERROR", // Si el backend no envía un código específico, usamos uno genérico de error de red.
           message: data.message, // El mensaje "crudo" que viene del backend, útil para logs o debugging. Este no se muestra directamente al usuario, sino que se mapea a un mensaje más amigable usando AUTH_ERRORS.
         },
       };
     }

     return {
       success: true,
       data,
     };
  }

  //queda sin logout porque seguimos la estrategia de JWT stateless, donde el backend no mantiene sesión y el frontend solo borra el token para "cerrar sesión"
};
