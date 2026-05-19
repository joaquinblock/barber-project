import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionRangeDto } from './dto/create-exception-range.dto';
import { CreateExceptionFullDayDto } from './dto/create-exception-full-day.dto';
import { ExceptionResponseDTO } from '@business/shared';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from '@business/shared/types';
import { Roles } from '@/common/decorators/roles.decorator';
import { GetProfessional } from '@/common/decorators/get-professional.decorator';

@Controller('exceptions')
@UseGuards(AuthGuard, RolesGuard)
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  @Get('me')
  @Roles(UserRole.PROFESSIONAL)
  async getMyExceptions(
    @GetProfessional() professional: { professionalId: string, businessId: string },
  ): Promise<ExceptionResponseDTO[]> {
    return this.exceptionsService.findAllExceptionsByProfessional(professional.businessId, professional.professionalId);
  }

  @Post('full-day')
  @Roles(UserRole.PROFESSIONAL)
  createFullDay(
    @Body() createFullDayDto: CreateExceptionFullDayDto,
    @GetProfessional() professional: { professionalId: string, businessId: string },
  ) {
    return this.exceptionsService.createExceptionFullDay(createFullDayDto, professional.businessId, professional.professionalId);
  }

  @Post('range')
  @Roles(UserRole.PROFESSIONAL)
  createRange(
    @Body() createRangeDto: CreateExceptionRangeDto,
    @GetProfessional() professional: { professionalId: string, businessId: string },
  ) {
    return this.exceptionsService.createExceptionRange(createRangeDto, professional.businessId, professional.professionalId);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSIONAL)
  async deleteException(
    @Param('id') id: string,
    @GetProfessional() professional: { professionalId: string, businessId: string },
  ): Promise<void> {
    return this.exceptionsService.deleteException(id, professional.businessId, professional.professionalId);
  }
}
