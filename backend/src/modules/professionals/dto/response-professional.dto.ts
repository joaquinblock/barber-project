import { ResponseProfessionalDTO } from '@business/shared';
import { Expose, Type } from 'class-transformer';


export class ResponseProfessionalDto implements ResponseProfessionalDTO {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() fullName: string;
  @Expose() phone: string | null;
  @Expose() isActive: boolean;
  @Expose() avatarUrl: string | null;
  @Expose() slotDurationMinutes: number | null;
  @Expose() bio: string | null;
  @Expose() photoUrl: string | null;
  @Expose() commissionPercent: number | null;
  @Expose() calendarColor: string | null;
  @Expose() isAvailable: boolean;
  @Expose() userId: string;
  @Expose() businessId: string;
}