import { faker } from "@faker-js/faker"
import { Roles } from "../../domain/roles/Roles-model"
import { Users } from "../../domain/users/Users-model"
import { Services } from "../../domain/services/Services-model"
import { AppDataSource } from "../db"
import bcrypt from "bcrypt"
import { Appointments } from "../../domain/appointments/Appointments-model"

// Función para generar usuarios falsos con Faker
const generateFakeUser = () => {
  const user = new Users()
  user.first_name = faker.person.firstName()
  user.last_name = faker.person.lastName()
  user.email = faker.internet.email()
  user.password = bcrypt.hashSync("123456789", 12)
  user.roleId = 1
  return user
}
const generateFakeAdmin = () => {
  const user = new Users()
  user.first_name = faker.person.firstName()
  user.last_name = faker.person.lastName()
  user.email = "admin@admin.com"
  user.password = bcrypt.hashSync("123456789", 12)
  user.roleId = 2
  return user
}

const generateFakeSuperAdmin = () => {
  const user = new Users()
  user.first_name = faker.person.firstName()
  user.last_name = faker.person.lastName()
  user.email = "superdmin@superadmin.com"
  user.password = bcrypt.hashSync("123456789", 12)
  user.roleId = 3
  return user
}

const generateFakeAppointments =  () => {
  const serviceId = faker.number.int({ min: 1, max: 6 })
  const userId = faker.number.int({ min: 1, max: 10 })

  const appointment = new Appointments()
  appointment.appointment_date = faker.date.future()

  const service = new Services
  service.id = serviceId

  const user = new Users
  user.id = userId

  appointment.user =  user 
  appointment.service = service 

  return appointment
}

interface ServiceInterface {
  serviceName: string
  description: string
}

const services: ServiceInterface[] = [
  {
    serviceName: "Tatuaje Personalizado",
    description:
      "Diseños personalizados de tatuajes que se adaptan a tus ideas y estilo único.",
  },
  {
    serviceName: "Piercing Corporal",
    description:
      "Servicios profesionales de piercing en diversas áreas del cuerpo, realizados con el máximo cuidado y con equipamiento esterilizado.",
  },
  {
    serviceName: "Tatuaje de Realismo",
    description:
      "Especialización en tatuajes realistas, capturando la esencia y detalle de las imágenes y fotografías.",
  },
  {
    serviceName: "Cover-Up de Tatuajes",
    description:
      "Transformación y mejoramiento de tatuajes previos, cubriendo y renovando tatuajes antiguos o no deseados.",
  },
  {
    serviceName: "Microdermal",
    description:
      "Piercings microdermales que ofrecen una alternativa moderna y menos invasiva para adornar tu cuerpo.",
  },
  {
    serviceName: "Eliminación de Tatuajes",
    description:
      "Servicio de eliminación de tatuajes con tecnología láser, para aquellos que desean borrar su tinta.",
  },
]

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize()

    const role = new Roles()
    role.name = "user"
    role.id = 1
    await role.save()

    const roleAdmin = new Roles()
    roleAdmin.name = "admin"
    roleAdmin.id = 2
    await roleAdmin.save()

    const roleSuperAdmin = new Roles()
    roleSuperAdmin.name = "super_admin"
    roleSuperAdmin.id = 3
    await roleSuperAdmin.save()

    const fakeUsers = Array.from({ length: 10 }, generateFakeUser)
    await Users.save(fakeUsers)

    const fakeAdmin = generateFakeAdmin()
    await Users.save(fakeAdmin)

    const fakeSuperAdmin = generateFakeSuperAdmin()
    await Users.save(fakeSuperAdmin)

    //mapeo para meter los servicios en la tabla Services
    for (const serviceItem of services) {
      let service = new Services()
      service.serviceName = serviceItem.serviceName
      service.description = serviceItem.description
      await Services.save(service)
    }

    const fakeAppointments = Array.from(
      { length: 50 },
      generateFakeAppointments
    )
    await Appointments.save(fakeAppointments)

    console.log("TODO OK EN SEEDER")
  } catch (error) {
    console.log(error)
  } finally {
    await AppDataSource.destroy()
  }
}

seedDatabase()
