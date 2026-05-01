import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from '@/common/helpers/transforms/trim.transform';

export class ExceptionDto {
  @IsUUID('4', { message: 'El ID del barbero debe ser un UUID válido' })
  @IsNotEmpty()
  barberId!: string;

  @IsUUID('4', { message: 'El ID de la barbería debe ser un UUID válido' })
  @IsNotEmpty()
  barbershopId!: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason!: string;
}