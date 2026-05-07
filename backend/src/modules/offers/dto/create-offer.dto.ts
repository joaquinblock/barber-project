import { IsString, IsNotEmpty, IsNumber, Min, MaxLength, IsInt } from 'class-validator';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { CreateOfferDTO } from '@barber/shared/types';

export class CreateOfferDto implements CreateOfferDTO  {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @Trim()
  @IsString()
  description!: string | null;


  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales y sin puntos de miles' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;

  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(1, { message: 'La duración mínima es de 1 minuto' })
  duration!: number;
}