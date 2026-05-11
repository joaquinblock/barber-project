import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Barber } from '@/modules/barbers/entities/barber.entity';
import { ExceptionType } from '../enums/exception-types.enum';
import { Barbershop } from '@/modules/barbershop/entities/barbershop.entity';

@Entity('exceptions')
export class Exception {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: 'date', name: 'start_date' })
  startDate!: string; // Usamos string para que coincida con tu DateKey "YYYY-MM-DD"

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

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // --- RELACIÓN CON EL BARBERO ---

  @Index()
  @Column({ type: 'uuid', name: 'barber_id' })
  barberId!: string;

  @ManyToOne(() => Barber, (barber) => barber.exceptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barber_id' })
  barber!: Barber;

  // --- RELACIÓN CON LA BARBERÍA ---
  
  @Index()
  @Column({ type: 'uuid', name: 'barbershop_id' })
  barbershopId!: string;
  
  @ManyToOne(() => Barbershop, (barbershop) => barbershop.exceptions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barbershop_id' })
  barbershop!: Barbershop;
}
