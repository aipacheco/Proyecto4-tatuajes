import { Request, Response } from "express"
import * as Repository from "./repository"
import { isArrayEmpty } from "../../helpers/helpers"

export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const citas: any = await Repository.getMyAppointments(req)

    const isCitas = isArrayEmpty(citas)

    if (isCitas) {
      return res.status(400).json({
        success: true,
        message: "no tiene citas",
      })
    } else {
      return res.status(200).json({
        success: true,
        message: citas,
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    })
  }
}

export const createAppointment = async (req: Request, res: Response) => {
  const dataAppointment = req.body.appointment_date

  console.log(dataAppointment)
  // Validaciones

  // Llamar a la función en el repositorio para crear la cita

  const nuevaCita = await Repository.createAppointment(req)

  if (!nuevaCita) {
    return res.status(400).json({
      success: false,
      message: "error al crear la cita",
    })
  } else {
    return res.status(201).json({
      success: true,
      message: nuevaCita,
    })
  }
}

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const updateApp = await Repository.updateAppointment(req)

    if (updateApp) {
      return res.status(200).json({
        success: true,
        message: `Cita cambiada al día ${req.body.appointment_date}`
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    })
  }
}

export const getSingleAppointment = async (req: Request, res: Response) => {
  try {
    const getSingleApp = await Repository.getSingleAppointment(req)

    // console.log(getSingleApp)
    if (getSingleApp) {
      return res.status(200).json({
        success: true,
        message: getSingleApp,
      })
    } else {
      return res.status(400).json({
        success: false,
        message: "no se encuentra la cita",
      })
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    })
  }
}
