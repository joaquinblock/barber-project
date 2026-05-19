import { api } from "@/core/api/utils/api.wrapper";
import type { CreateAvailRequestDTO, AvailResponseDTO } from "@business/shared/types";


export class AvailService {
  
  private static readonly AVAILABILITY_ENDPOINT = "/availabilities";
  /**
   * GET: Obtiene la disponibilidad de un barbero por su ID.
   */
  static async getAvailByBarber(): Promise<AvailResponseDTO[]> {
    return api.get<AvailResponseDTO[]>(`${this.AVAILABILITY_ENDPOINT}/me`);
  }

  /**
   * POST: Crea una nueva disponibilidad para un día específico.
   */
  static async createAvail(
    createAvailDto: CreateAvailRequestDTO,
  ): Promise<AvailResponseDTO> {
    return api.post<AvailResponseDTO>(this.AVAILABILITY_ENDPOINT, createAvailDto);
  }

  /**
   * PATCH: Actualiza un intervalo de disponibilidad.
   */
  static async updateAvail(
    availId: string,
    updateAvailDto: Partial<CreateAvailRequestDTO>,
  ): Promise<AvailResponseDTO> {
    return api.patch<AvailResponseDTO>(`${this.AVAILABILITY_ENDPOINT}/${availId}`, updateAvailDto);
  }

  /**
   * DELETE: Elimina un intervalo específico.
   */
  static async deleteAvail(availId: string): Promise<void> {
    return api.delete<void>(`${this.AVAILABILITY_ENDPOINT}/${availId}`);
  }

  /**
   * DELETE: Elimina todos los intervalos de un día para un barbero.
   */
  static async deleteByDay(
    day: string,
  ): Promise<void> {
    return api.delete<void>(`${this.AVAILABILITY_ENDPOINT}/me/days/${day}`);
  }

};
