import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AvailService } from './avail.service';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';

@Controller('availabilities')
export class AvailController {
  constructor(private readonly availService: AvailService) {}

  @Get()
  findByBarber(@Query('barberId') barberId: string) {
    return this.availService.findByBarber(barberId);
  }

  @Post()
  create(@Body() createAvailDto: CreateAvailDto) {
    return {
      message: "¡Éxito! Esto crea una disponibilidad para un barbero específico",
      data: createAvailDto, // Aquí ves el JSON final
      timestamp: new Date().toISOString() // Opcional: para saber cuándo se procesó
    }
  }

}
