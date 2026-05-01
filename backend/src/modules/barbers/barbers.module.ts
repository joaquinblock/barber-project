import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { Barber } from './entities/barber.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Barber]), UsersModule], //importamos el modulo entero, al importar el UsersModule, Nest te da acceso a todo lo que ese módulo haya puesto en su lista de exports.
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
