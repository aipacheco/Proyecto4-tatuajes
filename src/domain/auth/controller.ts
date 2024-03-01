import { Request, Response } from "express"
import * as Repository from "./repository"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
  //si hay body y las keys vienen rellenas (no es un objeto vacío)
  if (req.body && Object.keys(req.body).length !== 0) {
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
      const result = await Repository.register(NewUser)

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
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the user",
      })
    }
  } else {
    //si mandan un objeto vacío
    res.status(400).json({
      success: false,
      message: "No data provided.",
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password

  // verifica si el correo electrónico y la contraseña se proporcionaron
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password required",
    }
  }

  // se le pasa a repository para que busque el usuario por email
  const userLogged = await Repository.findByEmail(email)

  // si repository no encuentra el usuario por email
  if (!userLogged) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // si el usuario existe, verifica si la contraseña es válida
  const isValidPassword = bcrypt.compareSync(password, userLogged.password)


  //si la contraseña no es válida
  if (!isValidPassword) {
    res.status(401).json({
      success: false,
      message: "Invalid password",
    })
  }
  //creacion del token
  const token = Jwt.sign(
    {
      userId: userLogged.id,
      roleId: userLogged.role_id.id,
      roleName: userLogged.role_id.name
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  )
  // devolver datos del usuario y el token
  return res.status(200).json({
    success: true,
    message: "User logged",
    token: token,
  })
}
