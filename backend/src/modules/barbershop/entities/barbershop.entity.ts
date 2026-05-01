import { Appt } from "@/modules/appointments/entities/appt.entity";
import { Avail } from "@/modules/availabilities/entities/avail.entity";
import { Barber } from "@/modules/barbers/entities/barber.entity";
import { Exception } from "@/modules/exceptions/entities/exception.entity";
import { Offer } from "@/modules/offers/entities/offer.entity";
import { Column, Entity, In, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('barbershops')
export class Barbershop {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string; // Campo virtual, no se almacena en la DB, se genera a partir del nombre

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({type: 'boolean', default: true})
  isActive!: boolean;

  @OneToMany(() => Appt, (appt) => appt.barbershop)
  appointments!: Appt[];

  @OneToMany(() => Barber, (barber) => barber.barbershop)
  barbers!: Barber[];

  @OneToMany(() => Avail, (avail) => avail.barbershop)
  availabilities!: Avail[];

  @OneToMany(() => Exception, (exception) => exception.barbershop)
  exceptions!: Exception[];

  @OneToMany(() => Offer, (offer) => offer.barbershop)
  offers!: Offer[];
}
