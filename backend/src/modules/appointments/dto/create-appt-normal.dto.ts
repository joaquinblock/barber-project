import { Equals, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { CreateApptDto } from "./create-appt.dto";
import { ApptType } from "../enums/appt-type.enum";
import { ApptStatus } from "../enums/appt-status.enum";
import { Trim } from "@/common/helpers/transforms/trim.transform";

// === DONE ===
export class CreateApptNormalDto extends CreateApptDto {
  @Equals(ApptType.APPT, { message: 'type debe ser appt' })
  type: ApptType.APPT = ApptType.APPT; // Valor fijo para este DTO, no se puede cambiar

  @Trim()
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  @IsUUID('4', { message: 'El ID del cliente debe ser un UUID válido' })
  customerId!: string;

  @Trim()
  @IsNotEmpty({ message: 'La oferta es obligatoria para generar los snapshots' })
  @IsUUID('4', { message: 'El ID del servicio debe ser un UUID válido' })
  offerId!: string;

  @Trim()
  @IsEnum(ApptStatus, { message: 'Estado no válido' })
  @IsOptional() // Si no lo mandan, el Service o la Entity usan el default
  status?: ApptStatus = ApptStatus.CONFIRMED;
}