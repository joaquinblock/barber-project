import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApptsService } from './appts.service';
import { CreateApptBlockedDto } from './dto/create-appt-blocked.dto';
import { CreateApptNormalDto } from './dto/create-appt-normal.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@business/shared/types';

@Controller('appointments')
export class ApptsController {
  constructor(private readonly apptsService: ApptsService) {}

  @Get()
  findByProfessional(@Query('professionalId') professionalId: string) {
    return this.apptsService.findByProfessional(professionalId);
  }

  @Post()
  create(@Body() createApptDto: CreateApptNormalDto) {
    return {
      message: '¡Éxito! Esto crea una cita para un professionalo específico',
      data: {
        ...createApptDto,
        dateValue: createApptDto.date,
        dateType: typeof createApptDto.date,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('block')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  createBlock(@Body() createApptBlockedDto: CreateApptBlockedDto) {
    return {
      message: '¡Éxito! Esto bloquea un horario para un professionalo específico',
      data: createApptBlockedDto,
      timestamp: new Date().toISOString(),
    };
  }
}
