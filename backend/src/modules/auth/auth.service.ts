import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { BarbershopService } from '../barbershop/barbershop.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDTO, User as SharedUser } from '@barber/shared/types';
import { UserRole } from '@/modules/users/enum/user-role.enum';
import { plainToInstance } from 'class-transformer';
import { BarberUserDto } from '../barbers/dto/barber-user.dto';
import { CustomerUserDto } from '../customers/dto/customer-user.dto';
import { AdminUserDto } from '../users/dto/admin-user.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly barbershopService: BarbershopService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDTO> {
    const { email, password, slug } = loginDto;

    this.logger.log(`Login attempt for user: ${email}`);

    // 1. Validar Barbería
    const barbershop = await this.barbershopService.findOneBySlug(slug);
    // 2. Validar Usuario
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }

    // 3. Validar Contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    // 4. Validar Pertenencia y Roles
    // El rol CUSTOMER es global, pero BARBER debe pertenecer a la barbería del slug
    if (user.roles.includes(UserRole.BARBER)) {
      if (!user.barber || user.barber.barbershopId !== barbershop.id) {
        throw new ForbiddenException('No tienes permiso para acceder a esta barbería como barbero');
      }
    }

    this.logger.log(`User ${user.email} logged in successfully`);

    // Si es CUSTOMER (o ADMIN), permitimos el acceso globalmente por ahora 
    // (o podrías añadir lógica específica si Admin tiene restricciones)

    // 5. Generar Token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles,
      barbershopId: barbershop.id 
    };

    const token = this.jwtService.sign(payload); //payload es el objeto que se va a firmar, con el JWT Service 

    // 6. Preparar Respuesta mapeando al contrato compartido
    return {
      user: this.mapUserToContract(user),
      token,
      barbershopId: barbershop.id,
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOneByEmail(payload.email);
      if (!user) throw new UnauthorizedException();
      
      return {
        user: this.mapUserToContract(user),
        barbershopId: payload.barbershopId,
      };
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Mapea un usuario de la base de datos al contrato compartido User (BarberUser | CustomerUser | AdminUser).
   * Utiliza plainToInstance con los DTOs de respuesta para asegurar que solo se expongan los campos necesarios.
   */
  private mapUserToContract(user: any): SharedUser {
    if (user.roles.includes(UserRole.BARBER)) {
      return plainToInstance(BarberUserDto, user, { excludeExtraneousValues: true });
    }
    
    if (user.roles.includes(UserRole.CUSTOMER)) {
      return plainToInstance(CustomerUserDto, user, { excludeExtraneousValues: true });
    }

    // Por defecto es AdminUser
    return plainToInstance(AdminUserDto, user, { excludeExtraneousValues: true });
  }
}
