import { api } from "@/core/api/utils/api.wrapper";
import type { OfferRequestDTO, OfferResponseDTO } from "@barber/shared/types";

export class OfferService {
  private static readonly OFFERS_ENDPOINT = "/api/offers";

  /**
   * GET: Obtiene los servicios ofrecidos por un barbero por su ID.
   */
  static async getOffers(): Promise<OfferResponseDTO[]> {
    return api.get<OfferResponseDTO[]>(`${this.OFFERS_ENDPOINT}/me`);
  }

  /**
   * POST: Crea un nuevo servicio ofrecido por el barbero.
   */
  static async createOffer(
    createOfferDto: OfferRequestDTO,
  ): Promise<OfferResponseDTO> {
    return api.post<OfferResponseDTO>(this.OFFERS_ENDPOINT, createOfferDto);
  }

  /**
   * PATCH: Actualiza un servicio ofrecido por el barbero.
   */
  static async updateOffer(
    offerId: string,
    updateOfferDto: Partial<OfferRequestDTO>,
  ): Promise<OfferResponseDTO> {
    return api.patch<OfferResponseDTO>(`${this.OFFERS_ENDPOINT}/${offerId}`, updateOfferDto);
  }

  /**
   * DELETE: Elimina un servicio ofrecido por el barbero.
   */
  static async deleteOffer(offerId: string): Promise<void> {
    return api.delete<void>(`${this.OFFERS_ENDPOINT}/${offerId}`);
  }
}