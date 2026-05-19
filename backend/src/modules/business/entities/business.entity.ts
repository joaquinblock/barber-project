import { Appt } from "@/modules/appointments/entities/appt.entity";
import { Avail } from "@/modules/availabilities/entities/avail.entity";
import { Professional } from "@/modules/professionals/entities/professional.entity";
import { Exception } from "@/modules/exceptions/entities/exception.entity";
import { Offer } from "@/modules/offers/entities/offer.entity";
import { Column, Entity, In, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BusinessType } from "@business/shared";

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar", //no se usa enum por la rigidez de futuras expansiones
    length: 50,
    default: BusinessType.BARBERSHOP,
  })
  type!: BusinessType;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string; // Campo virtual, no se almacena en la DB, se genera a partir del nombre

  @Column({ type: 'varchar' , length: 255, nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoUrl!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({type: 'boolean', default: true})
  isActive!: boolean;

  @OneToMany(() => Appt, (appt) => appt.business)
  appointments!: Appt[];

  @OneToMany(() => Professional, (professional) => professional.business)
  professionals!: Professional[];

  @OneToMany(() => Avail, (avail) => avail.business)
  availabilities!: Avail[];

  @OneToMany(() => Exception, (exception) => exception.business)
  exceptions!: Exception[];

  @OneToMany(() => Offer, (offer) => offer.business)
  offers!: Offer[];
}
