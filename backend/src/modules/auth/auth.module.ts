import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BarbershopModule } from '../barbershop/barbershop.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'), // si no existe en el .env, lanzará un error
        signOptions: { expiresIn: '15d' },
      }),
    }),
    UsersModule,
    BarbershopModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
