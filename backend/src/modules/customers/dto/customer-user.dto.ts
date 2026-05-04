import { Expose, Type } from 'class-transformer';
import { CustomerUser, Customer as SharedCustomer } from '@barber/shared/types';

export class CustomerProfileDto implements SharedCustomer {
  @Expose() id: string;
  @Expose() birthDate: string | null;
  @Expose() loyaltyPoints: number | null;
}

export class CustomerUserDto implements CustomerUser {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() phone: string | null;
  @Expose() isActive: boolean;
  @Expose() avatarUrl: string | null;
  
  @Expose() roles: ('CUSTOMER')[];

  @Type(() => CustomerProfileDto)
  @Expose() customer: CustomerProfileDto;

  barber?: never;
}
