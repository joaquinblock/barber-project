import { 
  IsNotEmpty,
  IsUUID, 
  Matches, 
  IsISO8601, 
} from 'class-validator';
import { IsValidInterval } from '@/common/helpers/validators/is-valid-interval.validator';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { IsFutureDate} from '@/common/helpers/validators/is-future-date.validator';

// === DONE ===
export class CreateApptDto {
  @Trim()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { //validamos que tenga el formato exacto YYYY-MM-DD, no solo que sea una fecha válida, para evitar confusiones con otros formatos como MM-DD-YYYY o DD-MM-YYYY
    message: 'La fecha debe tener el formato exacto YYYY-MM-DD',
  })
  @IsISO8601({ strict: true }, { message: 'La fecha no existe en el calendario' }) //isDateString permite formatos de fecha como "2027-02-31" que no son fechas reales, con IsISO8601 y strict: true nos aseguramos de que la fecha sea válida y exista en el calendario
  @IsFutureDate({ message: 'La fecha debe ser hoy o en el futuro' })
  date!: string;

  @Trim()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Formato HH:mm' })
  startTime!: string;

  @IsValidInterval()
  @Trim()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Formato HH:mm' })
  endTime!: string;

  @Trim()
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID del professionalo debe ser un UUID válido' })
  professionalId!: string;

  @Trim()
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID de la professionalía debe ser un UUID válido' })
  businessId!: string;
}