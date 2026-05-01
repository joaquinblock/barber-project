import { Module } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { ExceptionsController } from './exceptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exception } from './entities/exception.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exception])], 
  controllers: [ExceptionsController],
  providers: [ExceptionsService],
})
export class ExceptionsModule {}
