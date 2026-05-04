import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BarbersModule } from './modules/barbers/barbers.module';
import { ApptsModule } from './modules/appointments/appts.module';
import { AvailModule } from './modules/availabilities/avail.module';
import { OffersModule } from './modules/offers/offers.module';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import { BarbershopModule } from './modules/barbershop/barbershop.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. Cargamos el ConfigModule globalmente
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Conectamos TypeORM usando las variables del .env
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Esto es clave para no importar cada entidad a mano
      synchronize: true,      // SOLO PARA DESARROLLO (crea las tablas solo)
    }),

    UsersModule,

    CustomersModule,

    BarbersModule,

    ApptsModule,

    AvailModule,

    OffersModule,

    ExceptionsModule,

    BarbershopModule,
    AuthModule
  ],
})
export class AppModule {}
