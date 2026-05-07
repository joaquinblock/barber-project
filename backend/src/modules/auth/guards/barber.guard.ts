import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BarberUser } from '@barber/shared/types';

/**
 * BarberGuard
 * * Implementa la interfaz CanActivate para actuar como un middleware de autorización.
 * Su propósito es interceptar peticiones HTTP para validar que el usuario posea
 * un token válido y cuente con el rol de 'BARBER'.
 */
@Injectable()
export class BarberGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

 /**
   * Intercepta la petición para validar la sesión del barbero.
   * 
   *  - SwitchToHttp() es un helper que convierte el ExecutionContext en un objeto que representa la petición HTTP.
   *  - getRequest() obtiene la petición HTTP entrante.
   *  - headers.authorization obtiene el header Authorization de la petición HTTP.
   *  - Split(' ')[1] separa el header Authorization en dos partes por el espacio y obtiene la segunda parte que es el token.
   *
   * @param context - ExecutionContext de NestJS que abstrae la petición actual.
   * @returns Promise<boolean> - true si el barbero está autorizado.
   * @throws UnauthorizedException - Si el token es inválido, expiró o el rol es incorrecto.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = await this.authService.verifyToken(token);
      const user = decoded.user as BarberUser;

      if (!user.roles?.includes('BARBER') || !user.barber) {
        throw new UnauthorizedException('El usuario no tiene un perfil de barbero asociado');
      }

    // Inyectamos la información del barbero en el request para que el controller la use, en realidad los usa el decorador get-barber.decorator
      request.barber = {
        barberId: user.barber.id,
        barbershopId: user.barber.barbershopId,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
