import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AvailService } from './avail.service';
import { CreateAvailDto } from './dto/create-avail.dto';
import { UpdateAvailDto } from './dto/update-availability.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { AvailResponseDTO, UserRole } from '@business/shared/types';
import { GetProfessional } from '@/common/decorators/get-professional.decorator';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';

/** 
 * Solo pueden entrar professionalos 
 */

@Controller('availabilities')
@UseGuards(AuthGuard, RolesGuard)
export class AvailController {
  constructor(private readonly availService: AvailService) {}

  @Get('me')
  @Roles(UserRole.PROFESSIONAL)
  async findByProfessional(@GetProfessional() professional: { professionalId: string, businessId: string }): Promise<AvailResponseDTO[]> {
    return this.availService.findAllAvailsByProfessional(professional.professionalId, professional.businessId);
  }

  @Post()
  @Roles(UserRole.PROFESSIONAL) 
  async create(
    @GetProfessional() professional: { professionalId: string, businessId: string },
    @Body() createAvailDto: CreateAvailDto
  ): Promise<AvailResponseDTO> {
    return this.availService.createAvailByProfessional(createAvailDto, professional.professionalId, professional.businessId);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSIONAL) 
  async update(
    @GetProfessional() professional: { professionalId: string, businessId: string },
    @Param('id') id: string,
    @Body() updateAvailDto: UpdateAvailDto
  ): Promise<AvailResponseDTO> {
    return this.availService.updateAvailByProfessional(id, updateAvailDto, professional.professionalId, professional.businessId);
  }

  @Delete('me/days/:dayOfWeek')
  @Roles(UserRole.PROFESSIONAL) 
  async removeByDay(
    @GetProfessional() professional: { professionalId: string, businessId: string },
    @Param('dayOfWeek') dayOfWeek: DayOfWeek,
  ): Promise<void> {
    return this.availService.removeAvailsByDay(dayOfWeek, professional.professionalId, professional.businessId);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSIONAL)
  async remove(
    @GetProfessional() professional: { professionalId: string, businessId: string },
    @Param('id') id: string
  ): Promise<void> {
    return this.availService.removeAvailByProfessional(id, professional.professionalId, professional.businessId);
  }
}
