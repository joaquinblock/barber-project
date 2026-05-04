import { Expose, Type } from 'class-transformer';
import { BarberUser, Barber as SharedBarber } from '@barber/shared/types';

/**
 * DTO que representa el perfil de barbero dentro del objeto de usuario.
 * Implementa SharedBarber para asegurar consistencia con el contrato compartido.
 */
export class BarberProfileDto implements SharedBarber {
  @Expose() id: string;
  @Expose() barbershopId: string;
  @Expose() slotDurationMinutes: number;
  @Expose() bio: string | null;
  @Expose() photoUrl: string | null;
  @Expose() commissionPercent: number;
  @Expose() calendarColor: string | null;
  @Expose() isAvailable: boolean;
}

/**
 * DTO de respuesta para un usuario de tipo Barbero.
 * Implementa BarberUser para garantizar que cumplimos el contrato con el frontend.
 * Si el tipo BarberUser cambia en packages/shared, TypeScript nos obligará a actualizar esta clase.
 */
export class BarberUserDto implements BarberUser {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() phone: string | null;
  @Expose() isActive: boolean;
  @Expose() avatarUrl: string | null;
  
  @Expose() roles: ('BARBER' | 'ADMIN')[];

  @Type(() => BarberProfileDto)
  @Expose() barber: BarberProfileDto;

  // TypeScript se encarga de que 'customer' sea 'never' si así está en el contrato
  customer?: never;
}
