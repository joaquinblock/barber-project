import { Module } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';
import { BarbershopController } from './barbershop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barbershop } from './entities/barbershop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop])],
  controllers: [BarbershopController],
  providers: [BarbershopService],
  exports: [BarbershopService], 
})
export class BarbershopModule {}
