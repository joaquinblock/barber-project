import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { BarbershopService } from '@/modules/barbershop/barbershop.service';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { Barbershop } from './entities/barbershop.entity';

@Controller('barbershop')
export class BarbershopController {
  constructor(private readonly barbershopService: BarbershopService) {}

  @Post()
  async create(@Body() createBarbershopDto: CreateBarbershopDto): Promise<Barbershop> {
    return await this.barbershopService.create(createBarbershopDto);
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return await this.barbershopService.findOneBySlug(slug);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.barbershopService.remove(id);
  }
}
