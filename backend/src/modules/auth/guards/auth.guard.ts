import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ErrorCode } from '@business/shared/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = await this.authService.verifyToken(token);
      
      // Inyectamos el usuario completo en la request
      request.user = decoded.user;
      
      // Mantenemos la compatibilidad con el decorador @GetProfessional si es un professionalo
      if (decoded.user.professional) {
        request.professional = {
          professionalId: decoded.user.professional.id,
          businessId: decoded.user.professional.businessId,
        };
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } 
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_TOKEN_INVALID,
        message: 'Token inválido o expirado',
      });
    }
  }
}
