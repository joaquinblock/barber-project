import { Controller, Get, Post, Body, Query, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { OfferResponseDTO, UserRole } from '@business/shared/types';
import { GetProfessional } from '@/common/decorators/get-professional.decorator';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
@UseGuards(AuthGuard, RolesGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('me')
  @Roles(UserRole.PROFESSIONAL)
  async findByProfessional(
    @GetProfessional() professional: { professionalId: string, businessId: string },
  ): Promise<OfferResponseDTO[]> {
    return await this.offersService.findAllOffersByProfessional(professional.businessId, professional.professionalId);
  }

  @Get('business/:businessId/professional/:professionalId')
  @Roles(UserRole.PROFESSIONAL, UserRole.CUSTOMER)
  async findAllByProfessionalId(
    @Param('businessId') businessId: string,
    @Param('professionalId') professionalId: string,
  ): Promise<OfferResponseDTO[]> {
    return await this.offersService.findAllOffersByProfessional(businessId, professionalId);
  }

  @Post()
  @Roles(UserRole.PROFESSIONAL)
  async createOffer(
    @Body() createOfferDto: CreateOfferDto, 
    @GetProfessional() professional: { professionalId: string, businessId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.createOfferByProfessional(createOfferDto, professional.businessId, professional.professionalId);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSIONAL)
  async updateOffer(
    @Param('id') id: string, 
    @Body() updateOfferDto: UpdateOfferDto, 
    @GetProfessional() professional: { professionalId: string, businessId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.updateOfferByProfessional(id, updateOfferDto, professional.businessId, professional.professionalId);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSIONAL)
  async removeOffer(
    @Param('id') id: string, 
    @GetProfessional() professional: { professionalId: string, businessId: string }
  ): Promise<void> {
    return await this.offersService.removeOfferByProfessional(id, professional.businessId, professional.professionalId);
  }

  
}
