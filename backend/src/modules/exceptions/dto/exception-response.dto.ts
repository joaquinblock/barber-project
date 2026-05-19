import { ToISOString } from "@/common/helpers/transforms/to-iso-string.transform";
import { DateKey, ExceptionResponseDTO } from "@business/shared";
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
    professionalId: string;
    
    @Expose()
    businessId: string;

    @Expose()
    @ToISOString()
    createdAt: string;

    @Expose()
    @ToISOString()
    updatedAt: string;


}