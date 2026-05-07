import { AvailResponseDTO as IAvailResponseDTO } from "@barber/shared/types";
import { Expose, Transform } from "class-transformer";
import { DayOfWeek } from "@/common/enums/day-of-week.enum";

export class AvailResponseDto implements IAvailResponseDTO {
    
    @Expose()
    id: string;

    @Expose()
    dayOfWeek: DayOfWeek;

    @Expose()
    startTime: string;

    @Expose()
    endTime: string;

    @Expose()
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    createdAt: string;

    @Expose()
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    updatedAt: string;

    @Expose()
    barberId: string;

    @Expose()
    barbershopId: string;
}
