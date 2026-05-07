import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { BarberUser } from '@barber/shared/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@barber/shared/types';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async registerBarber(@Body() createBarberDto: CreateBarberDto): Promise<BarberUser> {
    return await this.barbersService.registerBarber(createBarberDto);
  }
  
  @Patch('update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER, UserRole.ADMIN)
  async updateBarber(
    @Param('id') id: string,
    @Body() updateBarberDto: UpdateBarberDto
  ): Promise<BarberUser> {
    return await this.barbersService.updateBarber(id, updateBarberDto);
  }
}
