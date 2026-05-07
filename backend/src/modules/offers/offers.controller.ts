import { Controller, Get, Post, Body, Query, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { OfferResponseDTO, UserRole } from '@barber/shared/types';
import { GetBarber } from '@/common/decorators/get-barber.decorator';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  async findByBarber(
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ): Promise<OfferResponseDTO[]> {
    return await this.offersService.findAllOffersByBarber(barber.barberId, barber.barbershopId);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  async createOffer(
    @Body() createOfferDto: CreateOfferDto, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.createOfferByBarber(createOfferDto, barber.barberId, barber.barbershopId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  async updateOffer(
    @Param('id') id: string, 
    @Body() updateOfferDto: UpdateOfferDto, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.updateOfferByBarber(id, updateOfferDto, barber.barberId, barber.barbershopId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.BARBER)
  async removeOffer(
    @Param('id') id: string, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
  ): Promise<void> {
    return await this.offersService.removeOfferByBarber(id, barber.barberId, barber.barbershopId);
  }

  
}
