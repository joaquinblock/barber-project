import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { BusinessService } from '../business/business.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDTO, AuthResponseDTO, User, UserResponseDTO} from '@business/shared/types';
import { UserRole } from '@business/shared/types';
import { Logger } from '@nestjs/common';
import { ErrorCode } from '@business/shared/errors';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDTO> {
    const { email, password, slug } = loginDto;

    this.logger.log(`Login attempt for user: ${email}`);

    // 1. Validar Negocio
    const business = await this.businessService.findOneBySlug(slug);
    if (!business) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_SLUG,
        message: 'No se encontró un negocio con ese slug',
      });
    }
    // 2. Validar Usuario
    const user = await this.usersService.findPrivateByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_USER_NOT_FOUND,
        message: 'No se encontró una cuenta con ese correo electrónico',
      });
    }

    // 3. Validar Contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'La contraseña es incorrecta',
      });
    }

    this.logger.log(`User ${user.email} logged in successfully`);

    // 5. Generar Token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles,
      businessId: business.id 
    };

    const token = this.jwtService.sign(payload);

    // 6. Preparar Respuesta mapeando al contrato compartido
    return {
      user: this.usersService.mapToResponse(user), 
      token,
      businessId: business.id,
    };
  }

  async verifyToken(token: string): Promise<AuthResponseDTO> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneByEmail(payload.email);
      if (!user) throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Token inválido o expirado',
      });
      
      return {
        user: user,
        businessId: payload.businessId,
      };
    } catch (e) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Token inválido o expirado',
      });
    }
  }
}
