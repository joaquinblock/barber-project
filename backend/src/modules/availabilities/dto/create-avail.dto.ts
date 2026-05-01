import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TimeIntervalDto } from './time-interval.dto';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { IsNotOverlap } from '@/common/helpers/validators/is-not-overlap.validator';
import { Trim } from '@/common/helpers/transforms/trim.transform';

export class CreateAvailDto {
  @IsEnum(DayOfWeek, {
    message: `Día no válido. Opciones: ${Object.values(DayOfWeek).join(', ')}`,
  })
  dayOfWeek!: DayOfWeek;

  @IsNotEmpty({ message: 'isWorking es obligatorio' })
  @IsBoolean({ message: 'isWorking debe ser un booleano' })
  isWorking!: boolean;
  
  @Transform(({ value, obj }) => {
    // Si el barbero dice que NO trabaja, forzamos que intervals sea null
    if (obj.isWorking === false) return null;
    return value;
  })
  @ValidateIf((o) => o.isWorking === true) // Solo valida intervals si isWorking es true, osea si trabajas tenes que tener intervalos de tiempo, sino no es necesario
  @IsArray({ message: 'intervals debe ser un arreglo' })
  @ArrayMinSize(1, {
    message: 'Si trabajas, debes tener al menos un intervalo de tiempo',
  })
  @IsNotOverlap({ message: 'Los intervalos de tiempo no pueden solaparse' })
  @ValidateNested({ each: true }) // Valida cada objeto dentro del arreglo
  @Type(() => TimeIntervalDto)
  @IsOptional()
  intervals?: TimeIntervalDto[];

  @Trim()
  @IsNotEmpty({ message: 'El barberId es obligatorio' })
  @IsUUID('4', { message: 'El barberId debe ser un UUID válido' })
  barberId!: string;

  @Trim()
  @IsNotEmpty({ message: 'El barbershopId es obligatorio' })
  @IsUUID('4', { message: 'El barbershopId debe ser un UUID válido' })
  barbershopId!: string;
}
