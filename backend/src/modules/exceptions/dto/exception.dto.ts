import { IsString, IsNotEmpty, IsUUID, MaxLength, Validate, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from '@/common/helpers/transforms/trim.transform';

export class ExceptionDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ValidateIf((obj) => obj.reason !== null)
  reason!: string | null;
}