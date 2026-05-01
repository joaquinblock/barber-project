import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApptsService } from './appts.service';
import { CreateApptBlockedDto } from './dto/create-appt-blocked.dto';
import { CreateApptNormalDto } from './dto/create-appt-normal.dto';

@Controller('appointments')
export class ApptsController {
  constructor(private readonly apptsService: ApptsService) {}

  @Get()
  findByBarber(@Query('barberId') barberId: string) {
    return this.apptsService.findByBarber(barberId);
  }

  @Post()
  create(@Body() createApptDto: CreateApptNormalDto) {
    return {
      message: '¡Éxito! Esto crea una cita para un barbero específico',
      data: {
        ...createApptDto,
        dateValue: createApptDto.date,
        dateType: typeof createApptDto.date,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('block')
  createBlock(@Body() createApptBlockedDto: CreateApptBlockedDto) {
    return {
      message: '¡Éxito! Esto bloquea un horario para un barbero específico',
      data: createApptBlockedDto,
      timestamp: new Date().toISOString(),
    };
  }
}
