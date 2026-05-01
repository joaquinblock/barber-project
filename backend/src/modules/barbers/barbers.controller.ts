import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entities/barber.entity';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Post('register')
  async registerBarber(@Body() createBarberDto: CreateBarberDto): Promise<Barber> {
    return await this.barbersService.registerBarber(createBarberDto);
  }
}
