import { Request, Response } from "express"
import * as Repository from "./repository"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { userLoginI } from "./router"


export const getUsers = async () => {
  let resultado = await Repository.getUsers()
  return resultado
}

export const createUser = async (req: Request, res: Response) => {
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  const password = req.body.password
  const email = req.body.email

  //validaciones
  if (password.length < 8 || password.length > 15) {
    return res.status(400).json({
      success: false,
      message: "Password must be min 8 or max 15 chars.",
    })
  }
  if (email.length < 0) {
    return res.status(400).json({
      success: false,
      message: "You have to provide an email.",
    })
  }
  //regex de email
  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  if (!validEmail.test(email)) {
    return res.status(400).json({
      success: false,
      message: "format email invalid",
    })
  }

  //encriptación de password
  const passEncript: string = bcrypt.hashSync(password, 12)

  const NewUser = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: passEncript,
    role_id: 1,
  }

  try {
    const result = await Repository.createUser(NewUser)

    //si llega vacío es que se ha creado en repository, lo traemos para mandar el response
    if (!result) {
      return res.status(201).json({
        success: true,
        message: "User created",
      })

      //si se recibe un obj de tipo User, es que ya existía el registro
    } else {
      return res.status(400).json({
        success: false,
        message: "email duplicated in DB",
      })
    }
    //manejo de errores del servidor
  } catch (error) {
    console.log("el error en controller", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
    })
  }
}

export const getSingleUser = async (req: Request, res: Response) => {
  //se accede al id a traves de req.params.id
  const userId = req.params.id
  //se le pasa parseado
  const user = await Repository.getSingleUser(parseInt(userId))
  //si lo que devuelve repository es null
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
    //si viene el usuario relleno
  } else {
    return user
  }
}

export const login = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password

  // Primero, verifica si el correo electrónico y la contraseña se proporcionaron
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password required",
    }
  }

  // Luego, intenta encontrar al usuario por correo electrónico
  const userLogged = await Repository.findByEmail(email)

  // Ahora verifica si el usuario existe
  if (!userLogged) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // Si el usuario existe, verifica si la contraseña es válida
  const isValidPassword = bcrypt.compareSync(password, userLogged.password)
  if (!isValidPassword) {
  res.status(401).json({
      success: false,
      message: "Invalid password",
    })
  }
  const token = Jwt.sign(
    {
      userId: userLogged.id,
      roleId: userLogged.role_id.id
    },
   process.env.JWT_SECRET as string,
    {
      expiresIn: "2h"
    }
  )
  // Devolver datos del usuario y el token
  return { user: userLogged, token }
  // Si llegamos aquí, el usuario existe y la contraseña es válida
}
