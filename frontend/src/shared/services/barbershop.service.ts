import type { BarbershopDTO } from "@barber/shared/types";
import { HttpError } from "../errors";
import { BarbershopError } from "./barbershop.error";

export const barbershopService = {
  getBySlug: async (slug: string): Promise<BarbershopDTO> => {
    const res = await fetch(`/api/barbershop/slug/${slug}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new BarbershopError('BARBERSHOP_NOT_FOUND', 'La barbería no existe');
      }
      throw new HttpError(res.status, 'Error en el servidor');
    }

    const body = await res.json();

    // Si el backend devuelve OperationResult, desempaquetamos
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        throw new BarbershopError(body.error.code, body.error.message);
      }
      return body.data;
    }

    // Si el backend devuelve directamente la data
    return body;
  },
};