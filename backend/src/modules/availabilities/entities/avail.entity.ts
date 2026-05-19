import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, 
} from 'typeorm';
import { Professional } from '@/modules/professionals/entities/professional.entity';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { Business } from '@/modules/business/entities/business.entity';


@Entity('availabilities')
export class Avail {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek!: DayOfWeek; // Ej: 'MON', 'TUE', 'WED', etc.

  @Column({ type: 'time', name: 'start_time' })
  startTime!: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime!: string;

  
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'professional_id' })
  professionalId!: string;

  @ManyToOne(() => Professional, (professional) => professional.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional!: Professional;

  
  @Column({ type: 'uuid', name: 'business_id' })
  businessId!: string;

  @ManyToOne(() => Business, (business) => business.availabilities, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

}
