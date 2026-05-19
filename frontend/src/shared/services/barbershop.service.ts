import type { BarbershopResponseDTO } from "@business/shared/types";
import { api } from "@/core/api/utils/api.wrapper";

export class barbershopService {
  static async getBySlug(slug: string): Promise<BarbershopResponseDTO> {
    // El wrapper 'api' ya maneja:
    // - Base URL (importado desde .env)
    // - Parseo de JSON
    // - Manejo de errores (lanza HttpError)
    // - Desempaquetado de body.data
    return api.get<BarbershopResponseDTO>(`/barbershop/slug/${slug}`);
  }
};