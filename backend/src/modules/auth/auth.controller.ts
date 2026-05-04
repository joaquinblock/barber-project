import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDTO } from '@barber/shared/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDTO> {
    return await this.authService.login(loginDto);
  }

  @Post('profile') // Podría ser GET con un AuthGuard, pero para simplificar ahora lo hacemos POST o GET
  @HttpCode(HttpStatus.OK)
  async profile(@Body('token') token: string): Promise<any> {
    // Implementación mínima para validar el token desde el frontend
    return this.authService.verifyToken(token);
  }
}
