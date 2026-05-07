import { HttpError, ApiError, ErrorCode } from "@barber/shared/errors";
import { AUTH_STORAGE_KEYS } from "../../auth/constants/auth.constants";

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de 204 No Content o respuestas vacías
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    if (!response.ok) {
      throw new HttpError(response.status, "Error en la petición (No Content)");
    }
    return undefined as T;
  }

  // Intentamos parsear el JSON incluso si la respuesta no es ok para obtener el mensaje de error del backend
  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch (e) {
    // No se pudo parsear el JSON — error de infraestructura puro
    throw new HttpError(response.status, "Error de red o formato de respuesta inválido");
  }

  if (!response.ok || !body.success) {
    // Si el backend mandó un code semántico → error de lógica de negocio (ApiError)
    if (body.error?.code) {
      throw new ApiError(body.error.code, body.error.message ?? "Error en la petición al servidor");
    }
    // Sin code semántico → error de infraestructura (HttpError)
    throw new HttpError(response.status, body.error?.message ?? "Error en la petición al servidor");
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