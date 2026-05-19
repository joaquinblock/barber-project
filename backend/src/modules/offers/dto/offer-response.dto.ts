import { Expose, Transform } from "class-transformer";
import { OfferResponseDTO } from "@business/shared";

export class OfferResponseDto implements OfferResponseDTO {
    @Expose()
    id!: string;
    
    @Expose()
    title!: string;
    
    @Expose()
    @Transform(({ value }) => Number(value))
    price!: number;
    
    @Expose()
    @Transform(({ value }) => Number(value))
    duration!: number;
    
    @Expose()
    description!: string;
    
    @Expose()
    isActive!: boolean;
    
    @Expose()
    @Transform(({ value }) => value.toISOString())
    createdAt!: string;
    
    @Expose()
    @Transform(({ value }) => value.toISOString())
    updatedAt!: string;
    
    @Expose()
    professionalId!: string;
    
    @Expose()
    businessId!: string;
}