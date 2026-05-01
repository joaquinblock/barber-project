import { Equals, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateApptDto } from './create-appt.dto';
import { Transform } from 'class-transformer';
import { ApptType } from '../enums/appt-type.enum';
import { Trim } from '@/common/helpers/transforms/trim.transform';

// === DONE ===
export class CreateApptBlockedDto extends CreateApptDto {
  @Equals(ApptType.BLOCKED, { message: 'type debe ser blocked' })
  type: ApptType.BLOCKED = ApptType.BLOCKED; // Valor fijo para este DTO, no se puede cambiar

  @Trim()
  @IsOptional()
  @IsString({ message: 'La razón debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La razón no puede exceder los 255 caracteres' })
  reason?: string;
}
