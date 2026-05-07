import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AvailService } from './avail.service';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { BarberGuard } from '../auth/guards/barber.guard';
import { GetBarber } from '@/common/decorators/get-barber.decorator';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';

@Controller('availabilities')
@UseGuards(BarberGuard)
export class AvailController {
  constructor(private readonly availService: AvailService) {}

  @Get('me') 
  async findByBarber(@GetBarber() barber: { barberId: string }) {
    return this.availService.findByBarber(barber.barberId);
  }

  @Post()
  async create(
    @GetBarber() barber: { barberId: string, barbershopId: string },
    @Body() createAvailDto: CreateAvailDto
  ) {
    return this.availService.create(createAvailDto, barber);
  }

  @Patch(':id')
  async update(
    @GetBarber() barber: { barberId: string },
    @Param('id') id: string,
    @Body() updateAvailDto: UpdateAvailDto
  ) {
    return this.availService.update(id, updateAvailDto, barber.barberId);
  }

  @Delete('me/days/:dayOfWeek')
  async removeByDay(
    @GetBarber() barber: { barberId: string },
    @Param('dayOfWeek') dayOfWeek: DayOfWeek,
  ) {
    return this.availService.removeByDay(barber.barberId, dayOfWeek);
  }

  @Delete(':id')
  async remove(
    @GetBarber() barber: { barberId: string },
    @Param('id') id: string
  ) {
    return this.availService.remove(id, barber.barberId);
  }
}
