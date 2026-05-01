import { PartialType } from "@nestjs/mapped-types";
import { CreateExceptionFullDayDto } from "./create-exception-full-day.dto";

export class UpdateExceptionFullDayDto extends PartialType(CreateExceptionFullDayDto) {}  