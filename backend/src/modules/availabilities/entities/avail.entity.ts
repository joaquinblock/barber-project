import { 
  Entity, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  PrimaryGeneratedColumn, 
} from 'typeorm';
import { Barber } from '@/modules/barbers/entities/barber.entity';
import { DayOfWeek } from '@/common/enums/day-of-week.enum';
import { Barbershop } from '@/modules/barbershop/entities/barbershop.entity';


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

  @Column({ name: 'barber_id' })
  barberId!: string;

  @ManyToOne(() => Barber, (barber) => barber.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barber_id' })
  barber!: Barber;

  
  @Column({ type: 'uuid', name: 'barbershop_id' })
  barbershopId!: string;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.availabilities, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barbershop_id' })
  barbershop!: Barbershop;
}
