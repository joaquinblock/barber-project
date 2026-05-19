import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';

import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business]), 
    forwardRef(() => AuthModule)
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService], 
})
export class BusinessModule {}
