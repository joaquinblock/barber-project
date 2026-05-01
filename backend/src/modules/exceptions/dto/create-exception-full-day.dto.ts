import {
  Equals,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ExceptionDto } from './exception.dto';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { ExceptionType } from '../enums/exception-types.enum';
import { IsFutureDate } from '@/common/helpers/validators/is-future-date.validator';

export class CreateExceptionFullDayDto extends ExceptionDto {
 @IsEnum(ExceptionType, { message: 'El tipo debe ser full-day' })
   @Equals(ExceptionType.FULL_DAY) // Forzamos que este DTO solo acepte FULL_DAY
   type: ExceptionType.FULL_DAY = ExceptionType.FULL_DAY; // Valor fijo para este DTO, no se puede cambiar

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'startDate debe tener el formato exacto YYYY-MM-DD (ej: 2026-03-27)',
  })
  @IsISO8601({ strict: true }, { message: 'startDate no es una fecha válida' })
  @IsFutureDate({ message: 'La fecha debe ser futura' })
  startDate!: string;
}
