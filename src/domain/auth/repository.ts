import { Users } from "../../models/Users"

export const register = async (user: any) => {
    const email: string = user.email
    const findEmail = await Users.findOneBy({ email: email })
  
    //si no existe, lo crea y no retorna nada para mandar el response en controller
    if (!findEmail) {
      const newUser = await Users.create(user).save()
    } else {
      return findEmail
    }
  }

  export const findByEmail = async (email: string) => {
    const user = await Users.findOne({
      where: {
        email: email,
      },
      relations: { role_id: true },
      select: {
        id: true,
        password: true,
        email: true,
        role_id: {
          id: true,
          name: true,
        },
      },
    })
    console.log(user)
    return user
  }