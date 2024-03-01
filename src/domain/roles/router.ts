import { Request, Response } from "express"
import * as Controller from "./controller"

//se recibe request desde el front y se le devuelve una response que va a venir desde controller
export const createRole = async (req: Request, res: Response) => {
  //si hay body y las keys vienen rellenas (no es un objeto vacío)
  if (req.body && Object.keys(req.body).length !== 0) {
    try {
      await Controller.createRole(req, res)
    } catch (error) {
      //error del servidor
      console.error(error)
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the role.",
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
