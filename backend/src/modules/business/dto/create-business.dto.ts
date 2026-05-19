import { ToPhoneNumber } from '@/common/helpers/transforms/to-phone-number.transform';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { BusinessType } from '@business/shared';
import { IsString, IsOptional, IsBoolean, MaxLength, MinLength, IsPhoneNumber, IsEnum } from 'class-validator';

export class CreateBusinessDto {
  @Trim()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre es demasiado corto' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  name!: string;


  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  @Trim()
  @MaxLength(255, { message: 'La dirección no puede superar los 255 caracteres' })
  address!: string | null;

  @IsOptional()
  @IsString({ message: 'La URL de la foto debe ser una cadena de texto' })
  @MaxLength(2048, { message: 'La URL de la foto no puede superar los 255 caracteres' })
  photoUrl!: string | null;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @ToPhoneNumber() // Elimina espacios en blanco tanto al inicio como al final y dentro del número
  @IsPhoneNumber('AR', { message: 'El teléfono debe ser un número de teléfono válido' })
  @MaxLength(20, { message: 'El teléfono no puede superar los 20 caracteres' })
  phone!: string | null;

  @IsEnum(BusinessType, { message: 'El tipo debe ser una cadena de texto' })
  type!: BusinessType;
}
