import { PartialType } from '@nestjs/mapped-types';
import { CreateApptDto } from './create-appt.dto';

export class UpdateApptDto extends PartialType(CreateApptDto) {}
