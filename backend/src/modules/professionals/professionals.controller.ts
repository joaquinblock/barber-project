import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { ProfessionalUser } from '@business/shared/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@business/shared/types';

@Controller('professionals')
@UseGuards(AuthGuard, RolesGuard)
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get('business/:businessId')
  @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.CUSTOMER)
  async getProfessionalsByBusinessId(@Param('businessId') businessId: string): Promise<ProfessionalUser[]> {
    return await this.professionalsService.getProfessionalsByBusinessId(businessId);
  }

  @Get(':professionalId')
  async getProfessionalByProfessionalId(@Param('professionalId') professionalId: string): Promise<ProfessionalUser> {
    return await this.professionalsService.getProfessionalByProfessionalId(professionalId);
  }

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async registerProfessional(@Body() createProfessionalDto: CreateProfessionalDto): Promise<ProfessionalUser> {
    return await this.professionalsService.registerProfessional(createProfessionalDto);
  }
  
  @Patch('update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  async updateProfessional(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto
  ): Promise<ProfessionalUser> {
    return await this.professionalsService.updateProfessional(id, updateProfessionalDto);
  }
}
