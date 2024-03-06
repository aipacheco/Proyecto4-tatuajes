import { Request, Response } from "express"
import * as Repository from "./repository"
import { isArrayEmpty, isValidPassword, validator } from "../../helpers/helpers"


export const getUsers = async (req: Request, res: Response) => {
  const email = req.query.email as string

  if (email) {
    try {
      const search = await Repository.getUserByEmail(email)
      const isEmpty = isArrayEmpty(search)

      if (!isEmpty) {
        return res.status(200).json({
          success: true,
          message: "User by email",
          data: search,
        })
      } else {
        return res.status(404).json({
          success: true,
          message: "User not found",
        })
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  } else {
    try {
      const resultado = await Repository.getUsers()

      return res.status(200).json({
        success: true,
        message: "Users in DB",
        data: resultado,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  }
}

export const updateProfile = async (req: Request, res: Response) => {

    const firstName: string = req.body.first_name
    const lastName: string = req.body.last_name
    const password: string = req.body.password

    //como son campos que pueden venir o no, vamos a comprobar si vienen
    if (firstName) {
      //pasa por la función de validaciones de helpers, para no repetir código
      const validName = validator(firstName, "First Name")
      // console.log(validName)
      if (validName) {
        return res.status(400).json({
          success: false,
          message: validName,
        })
      }
      //se sale la función cuando encuentra un error y no sigue ejecutando validaciones
    }

    if (lastName) {
      const validLastName = validator(lastName, "Last Name")
      if (validLastName) {
        return res.status(400).json({
          success: false,
          message: validLastName,
        })
      }
    }
    // //si viene password, ya que cambiarlo también es opcional
    if (password) {
      const validPassword = isValidPassword(password)
      if (validPassword) {
        return res.status(400).json({
          success: false,
          message: validPassword,
        })
      }
    }
    try {
      //le paso el req a repository para que tenga los datos y el token
      let resultado = await Repository.updateProfile(req)

      if (resultado) {
        return res.status(201).json({
          success: true,
          message: "Profile updated",
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      })
    }
  }

export const userProfile = async (req: Request, res: Response) => {
  try {
    let resultado = await Repository.userProfile(req)

    return res.status(200).json({
      success: true,
      message: "Your profile",
      data: resultado,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}
