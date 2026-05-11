import { HttpError, ApiError, ErrorCode } from "@barber/shared/errors";
import { AUTH_STORAGE_KEYS } from "../../auth/constants/auth.constants";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}


/**
 * Wrapper de fetch para simplificar las peticiones al API.
 * Maneja automáticamente:
 * - Inyección de tokens y headers comunes.
 * - Soporte para FormData y JSON.
 * - Parseo de JSON.
 * - Distinción entre HttpError (infraestructura) y ApiError (lógica de negocio).
 * - Desempaquetado de la estructura { success, data }.
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const barbershopId = localStorage.getItem(AUTH_STORAGE_KEYS.BARBERSHOP_ID);

  // Si el body es FormData, el navegador debe setear el Content-Type con el boundary.
  // No debemos setear application/json manualmente.
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(barbershopId && { "X-Barbershop-Id": barbershopId }),
    ...options.headers,
  };

  /* ==========================================
      Transporte
  ========================================== */
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (e) {
    /* La petición fue abortada o el servidor es inalcanzable. 
       Es un error de infraestructura o cliente.
    */
    throw new HttpError(0, "No se pudo conectar con el servidor. Verifica tu conexión.");
  }

  /* ==========================================
        204 No Content o respuestas vacías
  ========================================== */

  if (response.status === 204) {
    return undefined as T;
  }

  /* ==========================================
     Intentamos parsear siempre el body, incluso si la respuesta no es ok 
     para obtener el mensaje de error del backend.
     (si no es json lanzará una excepción y lo manejamos)
  ========================================== */
  let body: ApiResponse<T>;
  try {
    const text = await response.text();
    body = text ? JSON.parse(text) : { success: response.ok, data: undefined as T };
  } catch (e) {
    // No se pudo parsear el JSON — error de infraestructura puro o respuesta no JSON
    throw new HttpError(response.status, "Error de red o formato de respuesta inválido");
  }


  /* ==========================================
      Clasificación del error
  ========================================== */
  if (!response.ok || !body.success) {
    const code = body.error?.code ?? ErrorCode.SERVER_ERROR;
    const message = body.error?.message ?? "Error en la petición al servidor";
    
    if (code) {
      throw new ApiError(code, message); // backend procesó el error, tiene code semántico
    }

    throw new HttpError(response.status, message); // no hay code, error de infra
  }

  return body.data;
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  /**
   * Envía una petición POST. 
   * @param body Si es FormData, se envía tal cual. Si es objeto, se stringifica a JSON.
   */
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  /**
   * Envía una petición PUT.
   */
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  /**
   * Envía una petición PATCH.
   */
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  /**
   * Envía una petición DELETE.
   */
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};