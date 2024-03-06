import "reflect-metadata"
import "dotenv/config"
import { DataSource } from "typeorm"
import { Roles1708948450323 } from "./migrations/01Roles"
import { Users1708952337364 } from "./migrations/02Users"
import { Services1709024097884 } from "./migrations/03Services"
import { Appointments1709024653887 } from "./migrations/04Appointmens"
import { Roles } from "../domain/roles/Roles-model"
import { Users } from "../domain/users/Users-model"
import { Services } from "../domain/services/Services-model"
import { Appointments } from "../domain/appointments/Appointments-model"

//aqui van las tablas, en migrations, para poderlas usar posteriormente
//a tener en cuenta que el núm tras el nombre es importante para que se creen en ese orden 
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Roles, Users, Services, Appointments],
  migrations: [
    Roles1708948450323,
    Users1708952337364,
    Services1709024097884,
    Appointments1709024653887,
  ],
  synchronize: false,
  logging: false,
})
