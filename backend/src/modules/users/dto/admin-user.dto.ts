import { Expose } from 'class-transformer';
import { AdminUser } from '@barber/shared/types';

export class AdminUserDto implements AdminUser {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() phone: string | null;
  @Expose() isActive: boolean;
  @Expose() avatarUrl: string | null;
  
  @Expose() roles: ('ADMIN')[];

  barber?: never;
  customer?: never;
}
