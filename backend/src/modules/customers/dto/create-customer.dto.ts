import { Trim } from '@/common/helpers/transforms/trim.transform';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateCustomerDto extends CreateUserDto {
  @Trim() // Elimina espacios vacíos al inicio y al final
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthDate debe tener el formato YYYY-MM-DD',
  })
  birthDate!: string | null; 

  @IsOptional()
  @IsInt({ message: 'Los puntos de lealtad deben ser un número entero' })
  @Min(0, { message: 'Los puntos de lealtad no pueden ser negativos' })
  loyaltyPoints!: number; // Valor por defecto 0, pero puede ser actualizado luego
}
