import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Appt } from '@/modules/appointments/entities/appt.entity';

@Entity('customers') // Corregido: customers

export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // --- RELACIÓN CON USUARIO ---
  @Column({ 
    type: 'uuid', 
    name: 'user_id',
    unique: true, // Asegura que un usuario no pueda ser asociado a más de un cliente
  })
  userId!: string;

  @OneToOne(() => User, (user) => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // --- DATOS DE NEGOCIO ---

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate!: string | null; // En la DB es date, en TS lo manejamos mejor como string YYYY-MM-DD

  @Column({ type: 'int', name: 'loyalty_points', nullable: true })
  loyaltyPoints!: number | null;

  // --- RELACIONES ---
  @OneToMany(() => Appt, (appt) => appt.customer) // Corregido el nombre de la propiedad inversa
  appointments!: Appt[];
}
