import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BarbershopService } from '@/modules/barbershop/barbershop.service';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { Barbershop } from './entities/barbershop.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@barber/shared/types';

@Controller('barbershop')
export class BarbershopController {
  constructor(private readonly barbershopService: BarbershopService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createBarbershopDto: CreateBarbershopDto): Promise<Barbershop> {
    return await this.barbershopService.create(createBarbershopDto);
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return await this.barbershopService.findOneBySlug(slug);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return await this.barbershopService.remove(id);
  }
}
