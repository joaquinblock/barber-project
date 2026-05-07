import { api } from "@/core/auth/utils/api.wrapper";
import type { CreateAvailRequestDTO, AvailResponseDTO } from "@barber/shared/types";

const AVAILABILITY_ENDPOINT = "/availabilities";

export const AvailService = {
  /**
   * GET: Obtiene la disponibilidad de un barbero por su ID.
   */
  async getAvailByBarber(): Promise<AvailResponseDTO[]> {
    return api.get<AvailResponseDTO[]>(`${AVAILABILITY_ENDPOINT}/me`);
  },

  /**
   * POST: Crea una nueva disponibilidad para un día específico.
   */
  async createAvail(
    createAvailDto: CreateAvailRequestDTO,
  ): Promise<AvailResponseDTO> {
    return api.post<AvailResponseDTO>(AVAILABILITY_ENDPOINT, createAvailDto);
  },

  /**
   * PATCH: Actualiza un intervalo de disponibilidad.
   */
  async updateAvail(
    availId: string,
    updateAvailDto: Partial<CreateAvailRequestDTO>,
  ): Promise<AvailResponseDTO> {
    return api.patch<AvailResponseDTO>(`${AVAILABILITY_ENDPOINT}/${availId}`, updateAvailDto);
  },

  /**
   * DELETE: Elimina un intervalo específico.
   */
  async deleteAvail(availId: string): Promise<void> {
    return api.delete<void>(`${AVAILABILITY_ENDPOINT}/${availId}`);
  },

  /**
   * DELETE: Elimina todos los intervalos de un día para un barbero.
   */
  async deleteByDay(
    day: string,
  ): Promise<void> {
    return api.delete<void>(`${AVAILABILITY_ENDPOINT}/me/days/${day}`);
  },

  
};
