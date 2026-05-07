import { Barber } from '../../barbers/entities/barber.entity';
import { 
  Column, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn 
} from 'typeorm';
import { UserRole } from '@barber/shared/types';
import { Customer } from '@/modules/customers/entities/customer.entity';
import { Exclude } from 'class-transformer';

@Entity('users')

export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude() // Oculta la contraseña en la respuesta JSON
  password!: string;

  @Column({ 
    type: 'varchar',
    name: 'phone_number',  
    nullable: true })
  phone?: string | null; // Vital para n8n

  @Column()
  fullName!: string;

  @Column({ 
    default: true, 
    name: 'is_active' 
  })
  isActive!: boolean;

  @Column({ 
    type: 'enum', 
    enum: UserRole,
    array: true, 
    default: [UserRole.CUSTOMER] })
  roles!: UserRole[]; //Importante para los guards y login

  // --- RELACIONES ---

  //Si el usuario es un barbero, tendra una relacion 1 a 1 con la entidad Barber. Si no es barbero, esta propiedad será null.
  @OneToOne(() => Barber, (barber) => barber.user)
  barber?: Barber;

  //Si el usuario es un cliente, tendra una relacion 1 a 1 con la entidad Customer. Si no es cliente, esta propiedad será null.
  @OneToOne(() => Customer, (customer) => customer.user)
  customer?: Customer;

  //Nunca las relaciones barber y customer van a existir al mismo tiempo para un mismo usuario, porque un usuario no puede ser barbero y cliente a la vez. Esto se maneja desde la lógica de negocio al crear el usuario.
}
