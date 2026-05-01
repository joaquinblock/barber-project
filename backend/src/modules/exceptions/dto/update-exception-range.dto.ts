import { PartialType } from '@nestjs/mapped-types';
import { CreateExceptionRangeDto } from './create-exception-range.dto';

export class UpdateExceptionRangeDto extends PartialType(CreateExceptionRangeDto) {}
