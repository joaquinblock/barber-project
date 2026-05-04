import type { Barber } from './barber.types';
import type { Customer } from './customer.types';

export type UserRole = 'ADMIN' | 'BARBER' | 'CUSTOMER';

export type BaseUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  avatarUrl: string | null;
};

export type AdminUser = BaseUser & {
  roles: ('ADMIN')[];
  barber?: never; // Para asegurarnos de que un admin no tenga un perfil de barbero
  customer?: never; // Para asegurarnos de que un admin no tenga un perfil de cliente
};

export type BarberUser = BaseUser & {
  roles: ('BARBER' | 'ADMIN')[];
  barber: Barber; // Objeto completo del perfil
  customer?: never; // Para asegurarnos de que un barber no tenga un perfil de cliente
};

export type CustomerUser = BaseUser & {
  roles: ('CUSTOMER')[];
  customer: Customer; // Objeto completo del perfil
  barber?: never; // Para asegurarnos de que un cliente no tenga un perfil de barbero
};

export type User = AdminUser | BarberUser | CustomerUser;