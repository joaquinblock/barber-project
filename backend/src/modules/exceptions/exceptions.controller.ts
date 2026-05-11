import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionRangeDto } from './dto/create-exception-range.dto';
import { CreateExceptionFullDayDto } from './dto/create-exception-full-day.dto';
import { ExceptionResponseDTO } from '@barber/shared';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@barber/shared/types';
import { Roles } from '@/common/decorators/roles.decorator';
import { GetBarber } from '@/common/decorators/get-barber.decorator';

@Controller('exceptions')
@UseGuards(AuthGuard, RolesGuard)
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  @Get('me')
  @Roles(UserRole.BARBER)
  async getMyExceptions(
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ): Promise<ExceptionResponseDTO[]> {
    return this.exceptionsService.findAllExceptionsByBarber(barber.barbershopId, barber.barberId);
  }

  @Post('full-day')
  @Roles(UserRole.BARBER)
  createFullDay(
    @Body() createFullDayDto: CreateExceptionFullDayDto,
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ) {
    return this.exceptionsService.createExceptionFullDay(createFullDayDto, barber.barbershopId, barber.barberId);
  }

  @Post('range')
  @Roles(UserRole.BARBER)
  createRange(
    @Body() createRangeDto: CreateExceptionRangeDto,
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ) {
    return this.exceptionsService.createExceptionRange(createRangeDto, barber.barbershopId, barber.barberId);
  }

  @Delete(':id')
  @Roles(UserRole.BARBER)
  async deleteException(
    @Param('id') id: string,
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ): Promise<void> {
    return this.exceptionsService.deleteException(id, barber.barbershopId, barber.barberId);
  }
}
