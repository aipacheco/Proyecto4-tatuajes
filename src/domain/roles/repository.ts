//se importa la tabla para hacer la inserción en DB
import { Roles } from "./Roles-model"

export const createRole = async (name: string) => {
  //se chequea que no exista un registro igual

  const findRole = await Roles.findOneBy({
    name: name,
  })
  //si no existe, lo crea y no retorna nada o undefined para mandar el response en controller
  if (!findRole) {
    const newRole = await Roles.create({
      name: name,
    }).save()
    return undefined


  } else {
    //si existe lo retornamos para tratarlo en el controller
    return findRole
  }
}
