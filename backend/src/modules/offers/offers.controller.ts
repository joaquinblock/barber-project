import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findByBarber(
    @Query('barberId') barberId: string,
  ): Promise<Offer[]> {
    return await this.offersService.findByBarber(barberId);
  }

  @Post()
  async createOffer(@Body() createOfferDto: CreateOfferDto): Promise<Offer> {
    return await this.offersService.createOffer(createOfferDto);
  }
}
