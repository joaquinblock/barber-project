import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches
} from 'class-validator';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { IsValidInterval } from '@/common/helpers/validators/is-valid-interval.validator';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import type { CreateAvailRequestDTO } from '@barber/shared/types';

export class CreateAvailDto implements CreateAvailRequestDTO {
  @IsEnum(DayOfWeek, {
    message: `Día no válido. Opciones: ${Object.values(DayOfWeek).join(', ')}`,
  })
  dayOfWeek!: DayOfWeek;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'startTime debe ser HH:mm' })
  startTime!: string;

  @IsValidInterval()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'endTime debe ser HH:mm' })
  endTime!: string;

  //No incluye barberId ni barbershopId porque los tomamos del token.
}
