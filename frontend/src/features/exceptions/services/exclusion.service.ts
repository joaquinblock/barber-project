import { api } from "@/core/api/utils/api.wrapper";
import type { ExceptionResponseDTO } from "@business/shared/types";

const EXCLUSION_ENDPOINT = "/exceptions";

export class ExclusionService {
    /**
     * Obtiene las exclusiones (excepciones) de un barbero.
     */
    static async getByBarber(): Promise<ExceptionResponseDTO[]> {
        return api.get<ExceptionResponseDTO[]>(
            `${EXCLUSION_ENDPOINT}/me`
        );
    }

    static async createFullDay(startDate: string, reason: string | null): Promise<ExceptionResponseDTO> {
        return api.post<ExceptionResponseDTO>(
            `${EXCLUSION_ENDPOINT}/full-day`,
            { startDate, reason }
        );
    }

    static async createRange(startDate: string, endDate: string, reason: string | null): Promise<ExceptionResponseDTO> {
        return api.post<ExceptionResponseDTO>(
            `${EXCLUSION_ENDPOINT}/range`,
            { startDate, endDate, reason }
        );
    }

    static async delete(id: string): Promise<void> {
        return api.delete<void>(`${EXCLUSION_ENDPOINT}/${id}`);
    }
}