import { Module } from '@nestjs/common';
import { BarbershopService } from './barbershop.service';
import { BarbershopController } from './barbershop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barbershop } from './entities/barbershop.entity';

import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barbershop]), 
    forwardRef(() => AuthModule)
  ],
  controllers: [BarbershopController],
  providers: [BarbershopService],
  exports: [BarbershopService], 
})
export class BarbershopModule {}
