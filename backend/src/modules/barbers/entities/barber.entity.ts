import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Appt } from '@/modules/appointments/entities/appt.entity';
import { Avail } from '@/modules/availabilities/entities/avail.entity';
import { Exception } from '@/modules/exceptions/entities/exception.entity';
import { Barbershop } from '@/modules/barbershop/entities/barbershop.entity';

@Entity('barbers')
export class Barber {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ 
    default: 30, 
    name: 'slot_duration_minutes' 
  })
  slotDurationMinutes!: number;

  @Column({ 
    type: 'text',
    nullable: true, 
    name: 'bio' })
  bio?: string;

  @Column({ 
    nullable: true, 
    name: 'photo_url' 
  })
  photoUrl?: string;

  // Usamos precisión 5 y escala 2
  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: '0.4', 
    name: 'commission_percent',
    transformer: {
      //Se ejecuta al escribir en la DB: recibe un number y lo convierte a string con 2 decimales
      to: (value: number) => value,

      //Se ejecuta al leer de la DB: recibe un string y lo convierte a number
      from: (value: string) => parseFloat(value),
    },
  })
  commissionPercent!: number;

  @Column({ 
    default: '#000000', 
    nullable: true, 
    name: 'calendar_color' 
  })
  calendarColor?: string;

  @Column({ 
    default: true, 
    name: 'is_available' 
  })
  isAvailable!: boolean;

  // RELACIONES

  @Column({ 
    type: 'uuid', 
    name: 'barbershop_id' 
  })
  barbershopId!: string;

  @ManyToOne(() => Barbershop,(barbershop) => barbershop.barbers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barbershop_id' })
  barbershop!: Barbershop;
  
    // Propiedad explícita para el ID del usuario
  @Column({ 
    type: 'uuid', 
    name: 'user_id',
    unique: true, // Asegura que un usuario no pueda ser asociado a más de un barbero
  })
  userId!: string;

  // Relación OneToOne con User.
  // onDelete: 'CASCADE' asegura que si muere el User, muere el perfil de Barbero.
  @OneToOne(() => User, (user) => user.barber, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Avail, (av: Avail) => av.barber)
  availabilities!: Avail[];

  @OneToMany(() => Appt, (appt: Appt) => appt.barber)
  appointments!: Appt[];

  @OneToMany(() => Exception, (exception: Exception) => exception.barber)
  exceptions!: Exception[];

}
