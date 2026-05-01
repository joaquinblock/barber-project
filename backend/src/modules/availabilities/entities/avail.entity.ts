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

  @Column({ name: 'is_working', default: true })
  isWorking!: boolean;

  // Guardamos los intervalos como un JSONB (Poder puro de Postgres)
  @Column({ type: 'jsonb', nullable: true })
  intervals?: { startTime: string; endTime: string }[] | null; // Ej: [{ startTime: "09:00", endTime: "17:00" }, { startTime: "18:00", endTime: "21:00" }]

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
