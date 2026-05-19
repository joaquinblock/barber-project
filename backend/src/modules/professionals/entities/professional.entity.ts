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
import { Business } from '@/modules/business/entities/business.entity';

@Entity('professionals')
export class Professional {
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
  bio!: string | null;

  @Column({ 
    type: 'varchar',
    length: 2048, //por si son urls largas
    nullable: true, 
    name: 'photo_url' 
  })
  photoUrl!: string | null;

  // Usamos precisión 5 y escala 2
  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: '0.4', 
    name: 'commission_percent',
    nullable: true,
    transformer: {
      //Se ejecuta al escribir en la DB: recibe un number y lo convierte a string con 2 decimales
      to: (value: number) => value,

      //Se ejecuta al leer de la DB: recibe un string y lo convierte a number
      from: (value: string) => parseFloat(value),
    },
  })
  commissionPercent!: number | null;

  @Column({
    type: 'varchar', 
    length: 10, // para colores en formato Hex, p.ej. #FFFFFF, para RGB 
    default: '#000000', 
    nullable: true, 
    name: 'calendar_color' 
  })
  calendarColor!: string | null;

  @Column({
    type: 'boolean', 
    default: true, 
    name: 'is_available' 
  })
  isAvailable!: boolean;

  // RELACIONES

  @Column({ 
    type: 'uuid', 
    name: 'business_id' 
  })
  businessId!: string;

  @ManyToOne(() => Business,(business) => business.professionals, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
  
    // Propiedad explícita para el ID del usuario
  @Column({ 
    type: 'uuid', 
    name: 'user_id',
    unique: true, // Asegura que un usuario no pueda ser asociado a más de un professionalo
  })
  userId!: string;

  // Relación OneToOne con User.
  // onDelete: 'CASCADE' asegura que si muere el User, muere el perfil de Professionalo.
  @OneToOne(() => User, (user) => user.professional, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Avail, (av: Avail) => av.professional)
  availabilities!: Avail[];

  @OneToMany(() => Appt, (appt: Appt) => appt.professional)
  appointments!: Appt[];

  @OneToMany(() => Exception, (exception: Exception) => exception.professional)
  exceptions!: Exception[];

}
