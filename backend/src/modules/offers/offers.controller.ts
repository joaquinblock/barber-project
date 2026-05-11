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
@UseGuards(AuthGuard, RolesGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('me')
  @Roles(UserRole.BARBER)
  async findByBarber(
    @GetBarber() barber: { barberId: string, barbershopId: string },
  ): Promise<OfferResponseDTO[]> {
    return await this.offersService.findAllOffersByBarber(barber.barbershopId, barber.barberId);
  }

  @Get('barbershop/:barbershopId/barber/:barberId')
  @Roles(UserRole.BARBER, UserRole.CUSTOMER)
  async findAllByBarberId(
    @Param('barbershopId') barbershopId: string,
    @Param('barberId') barberId: string,
  ): Promise<OfferResponseDTO[]> {
    return await this.offersService.findAllOffersByBarber(barbershopId, barberId);
  }

  @Post()
  @Roles(UserRole.BARBER)
  async createOffer(
    @Body() createOfferDto: CreateOfferDto, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.createOfferByBarber(createOfferDto, barber.barbershopId, barber.barberId);
  }

  @Patch(':id')
  @Roles(UserRole.BARBER)
  async updateOffer(
    @Param('id') id: string, 
    @Body() updateOfferDto: UpdateOfferDto, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
    ): Promise<OfferResponseDTO> {
    return await this.offersService.updateOfferByBarber(id, updateOfferDto, barber.barbershopId, barber.barberId);
  }

  @Delete(':id')
  @Roles(UserRole.BARBER)
  async removeOffer(
    @Param('id') id: string, 
    @GetBarber() barber: { barberId: string, barbershopId: string }
  ): Promise<void> {
    return await this.offersService.removeOfferByBarber(id, barber.barbershopId, barber.barberId);
  }

  
}
