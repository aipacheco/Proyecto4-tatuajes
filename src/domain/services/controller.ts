import { Request, Response } from "express"
import * as Repository from "./repository"
import { isValidLongText, validator } from "../../helpers/helpers"

export const getServices = async (req: Request, res: Response) => {
  try {
    const resultado = await Repository.getServices()

    return res.status(200).json({
      success: true,
      message: "All services",
      data: resultado,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const createService = async (req: Request, res: Response) => {

  const serviceName: string = req.body.serviceName
  const description: string = req.body.description

  //validaciones
  const validServiceName = validator(serviceName, "Service Name")

  if (validServiceName) {
    return res.status(400).json({
      success: false,
      message: validServiceName,
    })
  }

  const validServiceDescription = isValidLongText(
    description,
    "Service Description"
  )

  if (validServiceDescription) {
    return res.status(400).json({
      success: false,
      message: validServiceDescription,
    })
  }

  const NewService = {
    serviceName: serviceName,
    description: description,
  }
  try {
    const result = await Repository.createService(NewService)

    //si llega vacío es que se ha creado en repository, lo traemos para mandar el response
    if (!result) {
      return res.status(201).json({
        success: true,
        message: "Service created",
      })

      //si se recibe un obj de tipo Service, es que ya existía el registro
    } else {
      return res.status(400).json({
        success: false,
        message: "service name existing in DB",
      })
    }

    //manejo de errores del servidor
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the service",
    })
  }

}

