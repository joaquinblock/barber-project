import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Professional } from '@/modules/professionals/entities/professional.entity';
import { ExceptionType } from '../enums/exception-types.enum';
import { Business } from '@/modules/business/entities/business.entity';

@Entity('exceptions')
export class Exception {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: 'date', name: 'start_date' })
  startDate!: string;

  @Index()
  @Column({ type: 'date', name: 'end_date' })
  endDate!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason!: string | null;

  @Column({
    type: 'enum',
    enum: ExceptionType,
    default: ExceptionType.FULL_DAY
  })
  type!: ExceptionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  // --- RELACIÓN CON EL PROFESSIONALO ---

  @Index()
  @Column({ type: 'uuid', name: 'professional_id' })
  professionalId!: string;

  @ManyToOne(() => Professional, (professional) => professional.exceptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional!: Professional;

  // --- RELACIÓN CON LA PROFESSIONALÍA ---
  
  @Index()
  @Column({ type: 'uuid', name: 'business_id' })
  businessId!: string;
  
  @ManyToOne(() => Business, (business) => business.exceptions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
}
