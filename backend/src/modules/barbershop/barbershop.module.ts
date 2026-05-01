import { Module } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';
import { BarbershopController } from './barbershop.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barbershop } from './entities/barbershop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop])],
  controllers: [BarbershopController],
  providers: [BarbershopService],
  exports: [TypeOrmModule], // Exportamos el módulo para que otros módulos puedan usar el repositorio de Barbershop
})
export class BarbershopModule {}
