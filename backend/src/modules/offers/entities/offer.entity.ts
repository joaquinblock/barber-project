import { Barber } from '@/modules/barbers/entities/barber.entity';
import { Barbershop } from '@/modules/barbershop/entities/barbershop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('offers')

export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Column({ type: 'text', nullable: true, default: null })
  description!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      //Se ejecuta al escribir en la DB: recibe un number y lo convierte a string con 2 decimales
      to: (value: number) => value,

      //Se ejecuta al leer de la DB: recibe un string y lo convierte a number
      from: (value: string) => parseFloat(value),
    },
  })
  // En la DB se verá como price, pero con precision para moneda
  price!: number;

  @Column({ type: 'integer' })
  // Duración en minutos, usamos integer que es más eficiente
  duration!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean; // Vital para "borrar" ofertas sin romper turnos viejos

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Index() // Índice para acelerar consultas por barberId
  @Column({ type: 'uuid', name: 'barber_id' })
  barberId!: string; // ID del barbero que ofrece este servicio, para consultas rápidas

  @ManyToOne(() => Barber, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barber_id' })
  barber!: Barber;

    @Index()
  @Column({ type: 'uuid', name: 'barbershop_id' })
  barbershopId!: string;

  @ManyToOne(() => Barbershop, (barbershop) => barbershop.offers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barbershop_id' })
  barbershop!: Barbershop;
}
