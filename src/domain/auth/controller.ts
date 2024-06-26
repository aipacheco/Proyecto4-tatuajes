import { Request, Response } from "express"
import * as Repository from "./repository"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { isValidEmail, isValidPassword, validator } from "../../Helpers/helpers"

export const register = async (req: Request, res: Response) => {
  const firstName: string = req.body.first_name
  const lastName: string = req.body.last_name
  const password: string = req.body.password
  const email: string = req.body.email

  //validaciones

  const validName = validator(firstName, "First Name")
  if (validName) {
    return res.status(400).json({
      success: false,
      message: validName,
    })
  }

  const validLastName = validator(lastName, "Last Name")
  if (validLastName) {
    return res.status(400).json({
      success: false,
      message: validLastName,
    })
  }

  const validPassword = isValidPassword(password)
  if (validPassword) {
    return res.status(400).json({
      success: false,
      message: validPassword,
    })
  }

  const validEmail = isValidEmail(email)
  if (validEmail) {
    return res.status(400).json({
      success: false,
      message: validEmail,
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
        message: "Usuario creado",
      })

      //si se recibe un obj de tipo User, es que ya existía el registro
    } else {
      return res.status(400).json({
        success: false,
        message: "Email duplicado en la base de datos",
      })
    }

    //manejo de errores del servidor
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error del servidor",
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
      message: "Usuario no encontrado",
    })
  }

  if (userLogged.isActive === false) {
    return res.status(403).json({
      success: false,
      message: "Usuario no autorizado",
    })
  }
  // si el usuario existe, verifica si la contraseña es válida
  const isValidPassword = bcrypt.compareSync(password, userLogged.password)

  //si la contraseña no es válida
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    })
  }
  //creacion del token
  const token = Jwt.sign(
    {
      userId: userLogged.id,
      roleId: userLogged.role_id.id,
      roleName: userLogged.role_id.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  )
  // devolver datos del usuario y el token
  return res.status(200).json({
    success: true,
    message: "Login correcto",
    data:userLogged.role_id.name, 
    token: token,
  })
}
