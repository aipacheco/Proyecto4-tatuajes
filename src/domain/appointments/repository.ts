import { Request } from "express"
import { Appointments } from "./Appointments-model"
import { Users } from "../users/Users-model"
import { Services } from "../services/Services-model"

export const getMyAppointments = async (req: Request) => {
  const user = await Users.findOneBy({ id: req.tokenData.userId })
  if (user) {
    const citas = await Appointments.find({
      relations: {
        user: true,
        service: true,
      },
      select: {
        id: true,
        appointment_date: true,
        service: {
          id: true,
          serviceName: true,
        },
      },
    })
    return citas
  }
}

export const createAppointment = async (req: Request) => {
  try {
    const user = await Users.findOneBy({ id: req.tokenData.userId })
    const service = await Services.findOne({
      where: { id: req.body.service_id },
    })
    if (user && service) {
      //para crear un registro en bbdd de una tabla intermedia no se puede hacer create(X).save() del tirón, hay que hacerlo en 2 pasos

      //PASO 1 Se crea el objeto pasándole los objetos completos de User y Service
      const newAppointment = Appointments.create({
        appointment_date: new Date(req.body.appointment_date),
        user: user,
        service: service,
      })

      //PASO 2 Se realiza el save sobre el objeto newAppointment que se ha creado en el Paso 1
      const crearCita = await newAppointment.save()
      return crearCita
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export const updateAppointment = async (req: Request) => {
  console.log(req.body)

  const user = await Users.findOneBy({ id: req.tokenData.userId })

  if (user) {
    const cita = await Appointments.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["service"],
    })

    if (cita) {
      const nuevaCita = Appointments.update(
        { id: parseInt(req.params.id) },
        { appointment_date: req.body.appointment_date }
      )
      return nuevaCita
    }
  }
}

export const getSingleAppointment = async (req: Request) => {
  const user = await Users.findOneBy({ id: req.tokenData.userId })

  if (user) {
    const cita = await Appointments.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["service"],
    })

    return cita
  }
}
