import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max, 
  IsUrl, 
  IsHexColor, 
  IsInt,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsUUID
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Trim } from '@/common/helpers/transforms/trim.transform';
import { ToUpperCase } from '@/common/helpers/transforms/to-uper-case.transform';

// === DONE ===

export class CreateBarberDto extends CreateUserDto {
  


  @IsString({ message: 'La bio debe ser un texto' })
  @IsOptional()
  @Trim() // Elimina espacios vacíos al inicio y al final
  bio?: string;

  @IsUrl({}, { message: 'La foto debe ser una URL válida' })
  @IsOptional()
  @Trim() // Elimina espacios vacíos al inicio y al final
  photoUrl?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La comisión debe ser un número con hasta 2 decimales' }) // acepta 0.55 pero no 0.555
  @Min(0, { message: 'La comisión mínima es 0%' })
  @Max(1, { message: 'La comisión máxima es 1 (100%)' })
  @IsOptional()
  commissionPercent?: number;

    @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(5, { message: 'Mínimo 5 minutos' })
  @Max(180, { message: 'Máximo 180 minutos' })
  @IsOptional()
  slotDurationMinutes?: number;

  @ToUpperCase() // Convierte el texto a mayúsculas
  @IsHexColor({ message: 'El color debe ser un código Hexadecimal válido (ej: #FF5733)' })
  @IsOptional()
  @Trim() // Elimina espacios vacíos al inicio y al final
  calendarColor?: string;

  // --- IS AVAILABLE ---
  @IsOptional()
  isAvailable?: boolean = true; // Por defecto, el barbero estará disponible
  @IsOptional()
  @IsBoolean({ message: 'isAdmin debe ser un valor booleano' })
  isAdmin: boolean = false; // Valor por defecto a false

  @Trim()
  @IsNotEmpty({ message: 'El barbershopId es obligatorio' })
  @IsUUID('4', { message: 'El barbershopId debe ser un UUID válido' })
  barbershopId!: string;
  

}