import { Module } from '@nestjs/common';
import { AvailService } from './avail.service';
import { AvailController } from './avail.controller';
import { Type } from 'class-transformer';
import { Avail } from './entities/avail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Avail]), AuthModule],
  controllers: [AvailController],
  providers: [AvailService],
})
export class AvailModule {}
