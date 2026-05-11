import { ExceptionResponseDTO } from "@barber/shared";
import { Expose, Transform } from "class-transformer";

export class ExceptionResponseDto implements ExceptionResponseDTO {
    @Expose()
    id: string;

    @Expose()
    startDate: string;

    @Expose()
    endDate: string;

    @Expose()
    reason: string | null;

    @Expose()
    type: "full-day" | "range";

    @Expose()
    barberId: string;
    
    @Expose()
    barbershopId: string;

    @Expose()
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    createdAt: string;

    @Expose()
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    updatedAt: string;


}