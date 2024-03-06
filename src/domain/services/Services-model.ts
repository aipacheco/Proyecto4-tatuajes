import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Appointments } from "../appointments/Appointments-model"

@Entity("services")
export class Services extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number
  @Column({ name: "service_name" })
  serviceName!: string
  @Column({ name: "description" })
  description!: string

  @OneToMany(() => Appointments, (appointment) => appointment.service)
  appointments!: Appointments[]
}
