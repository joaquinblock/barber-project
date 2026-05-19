import type { ResponseProfessionalDTO } from './professional.types';
import type { ResponseCustomerDTO } from './customer.types';

export const UserRole = {
  ADMIN: 'ADMIN',
  PROFESSIONAL: 'PROFESSIONAL',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Roles específicos para facilitar la discriminación y evitar combinaciones inválidas
export type AdminRole = typeof UserRole.ADMIN;
export type ProfessionalRole = typeof UserRole.PROFESSIONAL;
export type CustomerRole = typeof UserRole.CUSTOMER;

export type BaseUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  avatarUrl: string | null;
};

/**
 * Representa a un administrador del sistema (sin perfil de profesional ni cliente)
 */
export type AdminUser = BaseUser & {
  roles: [AdminRole];
  professional?: never;
  customer?: never;
};

/**
 * Representa a un profesional (barbero) con perfil completo
 */
export type ProfessionalUser = BaseUser & {
  roles: [ProfessionalRole];
  professional: ResponseProfessionalDTO;
  customer?: never;
};

/**
 * Representa a un profesional que además tiene permisos de administrador
 */
export type ProfessionalAdminUser = BaseUser & {
  roles: (ProfessionalRole | AdminRole)[];
  professional: ResponseProfessionalDTO;
  customer?: never;
};

/**
 * Representa a un cliente con su perfil de fidelidad
 */
export type CustomerUser = BaseUser & {
  roles: [CustomerRole];
  customer: ResponseCustomerDTO;
  professional?: never;
};

/**
 * Unión discriminada de todos los tipos de usuario.
 * Permite que TS infiera qué propiedades están disponibles basándose en 'professional', 'customer' o 'roles'.
 */
export type User = AdminUser | ProfessionalUser | ProfessionalAdminUser | CustomerUser;


/**
 * DTO de respuesta para transferencia de datos (Backend -> Frontend).
 * A diferencia de la unión 'User', este es un objeto plano que puede ser implementado por clases (DTOs).
 */
export type UserResponseDTO = BaseUser & {
  roles: UserRole[];
  professional: ResponseProfessionalDTO | null;
  customer: ResponseCustomerDTO | null;
  createdAt: string;
  updatedAt: string;
}