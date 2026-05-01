import { IsValidInterval } from "@/common/helpers/validators/is-valid-interval.validator";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class TimeIntervalDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'startTime debe ser HH:mm' })
  startTime!: string;

  @IsValidInterval()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'endTime debe ser HH:mm' })
  endTime!: string;
}