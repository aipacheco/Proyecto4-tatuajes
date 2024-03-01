import { Request, Response } from "express"
import * as Controller from "./controller"
import { Users } from "../../models/Users"

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usuarios = await Controller.getUsers()
    return res.status(200).json({
      success: true,
      message: "Users in DB",
      data: usuarios,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export const createUser = async (req: Request, res: Response) => {
  //si hay body y las keys vienen rellenas (no es un objeto vacío)
  if (req.body && Object.keys(req.body).length !== 0) {
    try {
      await Controller.createUser(req, res)
    } catch (error) {
      //error del servidor
      console.error("error en router", error)
      res.status(500).json({
        success: false,
        message: "An error occurred creating the user.",
      })
    }
  } else {
    //si viene vacío
    res.status(400).json({
      success: false,
      message: "No data provided.",
    })
  }
}

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    //le paso todo el req, lo trataremos en controller
    const singleUser = await Controller.getSingleUser(req, res)
    //si ha encontrado el user
    return res.status(200).json({
      success: true,
      message: `User ID: ${req.params.id}`,
      data: singleUser,
    })
  } catch (error) {
    //manejo de errores del servidor
    res.status(500).json({
      success: false,
      message: "server error",
    })
  }
}

export interface userLoginI {
  user: Users,
  token: string
}

export const login = async (req: Request, res: Response) => {
  try {

    const userLogin = await Controller.login(req, res)
    console.log("el user en el router" , userLogin.token)
    res.status(200).json(userLogin)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
    })
  }
}
