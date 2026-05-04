import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AvailService } from './avail.service';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';

@Controller('availabilities')
export class AvailController {
  constructor(private readonly availService: AvailService) {}

  @Get('barbers/:barberId')
  findByBarber(@Param('barberId') barberId: string) {
    return this.availService.findByBarber(barberId);
  }

  @Post()
  create(@Body() createAvailDto: CreateAvailDto) {
    return this.availService.create(createAvailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availService.remove(id);
  }

  @Delete('barbers/:barberId/days/:dayOfWeek')
  removeByDay(
    @Param('barberId') barberId: string,
    @Param('dayOfWeek') dayOfWeek: string,
  ) {
    return this.availService.removeByDay(barberId, dayOfWeek);
  }
}
