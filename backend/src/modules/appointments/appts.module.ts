import { Module } from '@nestjs/common';
import { ApptsService } from './appts.service';
import { ApptsController } from './appts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appt } from './entities/appt.entity';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appt]), AuthModule],
  controllers: [ApptsController],
  providers: [ApptsService],
})
export class ApptsModule {}
