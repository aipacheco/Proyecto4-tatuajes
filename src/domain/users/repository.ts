import { Users } from "../../models/Users"

export const getUsers = async () => {
  const users = await Users.find({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  })
  return users
}


export const getSingleUser = async (userId: number) => {
  const user = await Users.findOneBy({ id: userId })
  //lo retornamos como esté, se va a encargar controller de dar la respuesta
  return user
}


