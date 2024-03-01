import { Request, Response } from "express"
import * as Repository from "./repository"

export const createRole = async (req: Request, res: Response) => {
    //si hay body y las keys vienen rellenas (no es un objeto vacío)
  if (req.body && Object.keys(req.body).length !== 0) {
    //se accede al campo del json name
    const name: string = req.body.name

    //validaciones
    if (name.length > 20) {
      //se rellena la response dependiendo del error
      return res.status(400).json({
        success: false,
        message: "Role name must be under 10 characters",
      })
    }

    if (name === "") {
      return res.status(400).json({
        success: false,
        message: "Role name must be defined",
      })
    }
    //se le pasa el name si ha pasado las validaciones a repository
    //y devolverá una respuesta según si ha ido bien o no
    try {
      const result = await Repository.createRole(name)

      //si llega vacío es que se ha creado en repository, lo traemos para devolver una response
      if (!result) {
        return res.status(201).json({
          success: true,
          message: "Role created",
        })

        //si se recibe un obj de tipo Roles, es que ya existía el registro
      } else {
        return res.status(400).json({
          success: false,
          message: "Role existing, introduce new one",
        })
      }

      //manejo de errores del servidor
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the role",
      })
    }
  }else{
    res.status(400).json({
      success: false,
      message: "No data provided.",
    })
  }
}
