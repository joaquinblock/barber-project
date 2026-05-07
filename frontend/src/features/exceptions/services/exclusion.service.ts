import { api } from "@/core/api/utils/api.wrapper";
import type { ExceptionDTO } from "@barber/shared/types";

const EXCLUSION_ENDPOINT = "/exclusions";

export const ExclusionService = {
    /**
     * Obtiene las exclusiones (excepciones) de un barbero.
     */
    async getByBarber(
        barberId: string,
        barbershopId: string,
    ): Promise<ExceptionDTO[]> {
        // Corregido: antes usaba AVAILABILITY_ENDPOINT incorrectamente.
        // Ahora usa el wrapper 'api' que centraliza la lógica.
        return api.get<ExceptionDTO[]>(
            `${EXCLUSION_ENDPOINT}/barbers/${barberId}?barbershopId=${barbershopId}`
        );
    },
};