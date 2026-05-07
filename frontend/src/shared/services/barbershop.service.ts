import type { BarbershopDTO } from "@barber/shared/types";
import { api } from "@/core/api/utils/api.wrapper";

export const barbershopService = {
  getBySlug: async (slug: string): Promise<BarbershopDTO> => {
    // El wrapper 'api' ya maneja:
    // - Base URL (importado desde .env)
    // - Parseo de JSON
    // - Manejo de errores (lanza HttpError)
    // - Desempaquetado de body.data
    return api.get<BarbershopDTO>(`/barbershop/slug/${slug}`);
  },
};