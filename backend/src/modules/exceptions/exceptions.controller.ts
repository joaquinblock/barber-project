import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionRangeDto } from './dto/create-exception-range.dto';
import { CreateExceptionFullDayDto } from './dto/create-exception-full-day.dto';

@Controller('exceptions')
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  @Get()
  findByBarber(@Query('barberId') barberId: string) {
    return this.exceptionsService.findByBarber(barberId);
  }

  @Post('full-day')
  createFullDay(@Body() createFullDayDto: CreateExceptionFullDayDto) {
    return {
      message: '¡Éxito! Esto crea una excepción de día completo',
      data: createFullDayDto,
      timestamp: new Date().toISOString(),
    };
  }

  // RUTA 2: Para excepciones de rango (Ej: Vacaciones, reformas)
  @Post('range')
  createRange(@Body() createRangeDto: CreateExceptionRangeDto) {
    return {
      message: '¡Éxito! Esto crea una excepción por rango de fechas',
      data: createRangeDto,
      timestamp: new Date().toISOString(),
    };
  }
}
