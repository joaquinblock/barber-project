import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, MaxLength, IsInt, IsUUID } from 'class-validator';
import { Trim } from '@/common/helpers/transforms/trim.transform';

export class CreateOfferDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @Trim()
  @IsString()
  @IsOptional()
  description?: string;


  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales y sin puntos de miles' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;
  
  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(1, { message: 'La duración mínima es de 1 minuto' })
  duration!: number;

  @IsUUID('4', { message: 'El ID del barbero debe ser un UUID válido' })
  barberId!: string; // Lo recibimos como string, pero se validará en el service que exista el barbero

  @IsUUID('4', { message: 'El ID de la barbería debe ser un UUID válido' })
  barbershopId!: string;
}