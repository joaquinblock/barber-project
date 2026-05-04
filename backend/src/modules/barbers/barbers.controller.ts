import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { Barber } from './entities/barber.entity';
import { BarberUser, User } from '@barber/shared/types';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get('barbershop/:barbershopId')
  async getBarbersByBarbershopId(@Param('barbershopId') barbershopId: string): Promise<BarberUser[]> {
    return await this.barbersService.getBarbersByBarbershopId(barbershopId);
  }

  @Get(':barberId')
  async getBarberByBarberId(@Param('barberId') barberId: string): Promise<BarberUser> {
    return await this.barbersService.getBarberByBarberId(barberId);
  }

  @Post('register')
  async registerBarber(@Body() createBarberDto: CreateBarberDto): Promise<BarberUser> {
    return await this.barbersService.registerBarber(createBarberDto);
  }
  
  @Patch('update/:id')
  async updateBarber(
    @Param('id') id: string,
    @Body() updateBarberDto: UpdateBarberDto
  ): Promise<BarberUser> {
    return await this.barbersService.updateBarber(id, updateBarberDto);
  }


}
