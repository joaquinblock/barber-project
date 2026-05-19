import { Expose, Type } from 'class-transformer';
import { UserRole, UserResponseDTO, ResponseProfessionalDTO, ResponseCustomerDTO } from '@business/shared/types';
import { ToISOString } from '@/common/helpers/transforms/to-iso-string.transform';

export class UserResponseDto implements UserResponseDTO {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() phone: string | null;
  @Expose() isActive: boolean;
  @Expose() avatarUrl: string | null;
  @Expose() roles: UserRole[];

  @Expose()
  @Type(() => Object) // Podríamos usar DTOs específicos aquí si fuera necesario
  professional: ResponseProfessionalDTO | null;

  @Expose()
  @Type(() => Object)
  customer: ResponseCustomerDTO | null;
  
  @Expose() 
  @ToISOString() 
  createdAt: string;
  
  @Expose() 
  @ToISOString() 
  updatedAt: string;
}
