import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  In,
} from 'typeorm';
import { Professional } from '@/modules/professionals/entities/professional.entity';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Offer } from '@/modules/offers/entities/offer.entity';
import { ApptType } from '../enums/appt-type.enum';
import { ApptStatus } from '../enums/appt-status.enum';
import { Business } from '@/modules/business/entities/business.entity';

@Entity('appointments')

export class Appt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index() // Índice para optimizar consultas por fecha
  @Column({ type: 'date' }) // Esto mapea tu DateKey (YYYY-MM-DD)
  date!: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime!: string; // "09:00"

  @Column({ type: 'time', name: 'end_time' })
  endTime!: string; // "09:30"

  @Column({
    type: 'enum',
    enum: ApptType,
  })
  type!: ApptType; // 'appt' o 'blocked'

  @Column({
    type: 'enum',
    enum: ApptStatus,
    default: ApptStatus.CONFIRMED, // <--- Todos nacen confirmados y listo
  })
  status!: ApptStatus;

  // --- RELACIONES ---
  @Index() // Índice para optimizar consultas por professionalo
  @Column({ type: 'uuid', name: 'professional_id' })
  professionalId!: string;

  // Muchos turnos pertenecen a UN professionalo
  @ManyToOne(() => Professional, (professional) => professional.appointments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'professional_id' })
  professional!: Professional;

  @Index()
  @Column({ type: 'uuid', name: 'business_id' })
  businessId!: string;
  
  @ManyToOne(() => Business, (business) => business.appointments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
  customerId?: string;

  // Muchos turnos pueden ser de UN cliente (nullable porque si es 'blocked' no hay cliente)
  @ManyToOne(() => Customer, (customer) => customer.appointments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @Column({ type: 'uuid', nullable: true, name: 'offer_id' })
  offerId?: string; // Solo si type === 'appt' y el cliente reservó una oferta específica

  @ManyToOne(() => Offer, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'offer_id' })
  offer?: Offer;

  // --- CAMPOS EXTRA SEGÚN EL TIPO ---

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true, 
    name: 'reason' 
  })
  reason?: string; // Solo si type === 'blocked'

  // Guardamos el precio y duración al momento de la reserva para no perder historial si luego cambian las ofertas
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'price_snapshot',
    nullable: true,
    transformer: {
      //Se ejecuta al escribir en la DB: recibe un number y lo convierte a string con 2 decimales
      to: (value: number) => value,

      //Se ejecuta al leer de la DB: recibe un string y lo convierte a number
      from: (value: string) => parseFloat(value),
    },
  })
  priceSnapshot?: number;

  @Column({
    type: 'integer',
    name: 'duration_snapshot',
    nullable: true,
  })
  durationSnapshot?: number;
}
