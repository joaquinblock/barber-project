import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Aquí puedes agregar tus entidades de usuario si las tienes
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos el módulo para que otros módulos puedan usar el servicio de User
})
export class UsersModule {}
