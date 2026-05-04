import type { OperationResult} from "@/shared/types";
import type { AvailErrorCode } from "../types";
import type { AvailabilityDTO, AvailabilityResponseDTO} from "@barber/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AVAILABILITY_ENDPOINT = `${API_BASE_URL}/availabilities`;

export const AvailService = {
  /**
   * GET: Obtiene la disponibilidad de un barbero por su ID.
   */
  async getByBarber(
    barberId: string,
    barbershopId: string,
  ): Promise<OperationResult<AvailabilityResponseDTO[], AvailErrorCode>> {
    try {
      const response = await fetch(
        `${AVAILABILITY_ENDPOINT}/barbers/${barberId}?barbershopId=${barbershopId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      const body = await response.json();

      if (!body.success) {
        return body as OperationResult<never, AvailErrorCode>;
      }

      const items: AvailabilityResponseDTO[] = Array.isArray(body.data) ? body.data : [body.data];

      return { success: true, data: items };
    } catch (e) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },

  /**
   * POST: Crea una nueva disponibilidad para un día específico.
   */
  async create(
    createAvailDto: AvailabilityDTO,
  ): Promise<OperationResult<AvailabilityResponseDTO, AvailErrorCode>> {
    try {
      const response = await fetch(`${AVAILABILITY_ENDPOINT}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createAvailDto),
      });

      const body = await response.json();

      if (!body.success) {
        return body as OperationResult<never, AvailErrorCode>;
      }

      return {
        success: true,
        data: body.data,
      };
    } catch (e) {
      // Error de red, timeout, JSON malformado, etc.
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },

  /**
   * DELETE: Elimina un intervalo de disponibilidad.
   */
  async delete(rangeId: string): Promise<OperationResult<void, AvailErrorCode>> {
    try {
      const response = await fetch(`${AVAILABILITY_ENDPOINT}/${rangeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });

      const body = await response.json();

      if (!body.success) {
        return body as OperationResult<never, AvailErrorCode>;
      }

      return { success: true, data: undefined };
    } catch (e) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },

  /**
   * DELETE: Elimina todos los intervalos de un día para un barbero.
   */
  async deleteByDay(
    barberId: string,
    day: string,
  ): Promise<OperationResult<void, AvailErrorCode>> {
    try {
      const response = await fetch(
        `${AVAILABILITY_ENDPOINT}/barbers/${barberId}/days/${day}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      const body = await response.json();

      if (!body.success) {
        return body as OperationResult<never, AvailErrorCode>;
      }

      return { success: true, data: undefined };
    } catch (e) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },
};
