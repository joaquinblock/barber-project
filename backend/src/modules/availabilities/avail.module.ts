import { Module } from '@nestjs/common';
import { AvailService } from './avail.service';
import { AvailController } from './avail.controller';
import { Type } from 'class-transformer';
import { Avail } from './entities/avail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Avail])],
  controllers: [AvailController],
  providers: [AvailService],
})
export class AvailModule {}
