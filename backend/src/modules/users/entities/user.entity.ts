import { Professional } from '../../professionals/entities/professional.entity';
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn
} from 'typeorm';
import { UserRole } from '@business/shared/types';
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
  phone!: string | null; // Vital para n8n

  @Column()
  fullName!: string;

  @Column({ 
    default: true, 
    name: 'is_active' 
  })
  isActive!: boolean;

  @Column({ 
    type: 'text', //no lo ponemos como enum porque es mas flexible para futuras expansiones
    array: true, 
    default: '{CUSTOMER}' //formato que acepta postgres para arrays: {ELEMENTO1, ELEMENTO2}
  })
  roles!: UserRole[]; //Importante para los guards y login

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- RELACIONES ---


  //Si el usuario es un professional, tendra una relacion 1 a 1 con la entidad Professional. Si no es professional, esta propiedad será null.
  @OneToOne(() => Professional, (professional) => professional.user)
  professional?: Professional;

  //Si el usuario es un cliente, tendra una relacion 1 a 1 con la entidad Customer. Si no es cliente, esta propiedad será null.
  @OneToOne(() => Customer, (customer) => customer.user)
  customer?: Customer;

  //Nunca las relaciones professional y customer van a existir al mismo tiempo para un mismo usuario, porque un usuario no puede ser professionalo y cliente a la vez. Esto se maneja desde la lógica de negocio al crear el usuario.
}
