import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
}
