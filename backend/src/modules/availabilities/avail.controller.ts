import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AvailService } from './avail.service';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { AvailResponseDTO, UserRole } from '@barber/shared/types';
import { GetBarber } from '@/common/decorators/get-barber.decorator';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';

/** 
 * Solo pueden entrar barberos 
 */

@Controller('availabilities')
@UseGuards(AuthGuard, RolesGuard)
export class AvailController {
  constructor(private readonly availService: AvailService) {}

  @Get('me')
  @Roles(UserRole.BARBER)
  async findByBarber(@GetBarber() barber: { barberId: string, barbershopId: string }): Promise<AvailResponseDTO[]> {
    return this.availService.findAllAvailsByBarber(barber.barberId, barber.barbershopId);
  }

  @Post()
  @Roles(UserRole.BARBER) 
  async create(
    @GetBarber() barber: { barberId: string, barbershopId: string },
    @Body() createAvailDto: CreateAvailDto
  ): Promise<AvailResponseDTO> {
    return this.availService.createAvailByBarber(createAvailDto, barber.barberId, barber.barbershopId);
  }

  @Patch(':id')
  @Roles(UserRole.BARBER) 
  async update(
    @GetBarber() barber: { barberId: string, barbershopId: string },
    @Param('id') id: string,
    @Body() updateAvailDto: UpdateAvailDto
  ): Promise<AvailResponseDTO> {
    return this.availService.updateAvailByBarber(id, updateAvailDto, barber.barberId, barber.barbershopId);
  }

  @Delete('me/days/:dayOfWeek')
  @Roles(UserRole.BARBER) 
  async removeByDay(
    @GetBarber() barber: { barberId: string, barbershopId: string },
    @Param('dayOfWeek') dayOfWeek: DayOfWeek,
  ): Promise<void> {
    return this.availService.removeAvailsByDay(dayOfWeek, barber.barberId, barber.barbershopId);
  }

  @Delete(':id')
  @Roles(UserRole.BARBER)
  async remove(
    @GetBarber() barber: { barberId: string, barbershopId: string },
    @Param('id') id: string
  ): Promise<void> {
    return this.availService.removeAvailByBarber(id, barber.barberId, barber.barbershopId);
  }
}
