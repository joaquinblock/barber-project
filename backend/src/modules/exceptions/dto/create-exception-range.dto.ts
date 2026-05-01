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
import { IsValidInterval } from '@/common/helpers/validators/is-valid-interval.validator';
import { ExceptionType } from '../enums/exception-types.enum';
import { IsFutureDate } from '@/common/helpers/validators/is-future-date.validator';
import { IsAfterDate } from '@/common/helpers/validators/is-after-date.validator';

export class CreateExceptionRangeDto extends ExceptionDto {
  @IsEnum(ExceptionType, { message: 'El tipo debe ser range' })
  type: ExceptionType.RANGE = ExceptionType.RANGE; // Valor fijo para este DTO, no se puede cambiar

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD',
  })
  @IsISO8601(
    { strict: true },
    { message: 'La fecha no existe en el calendario' },
  )
  @IsFutureDate({ message: 'La fecha debe ser futura' })
  startDate!: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsValidInterval()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD',
  })
  @IsISO8601(
    { strict: true },
    { message: 'La fecha no existe en el calendario' },
  )
  @IsFutureDate({ message: 'La fecha debe ser futura' })
  @IsAfterDate('startDate', { message: 'La fecha de fin debe ser posterior a la de inicio' })
  endDate!: string;
}
