import { Services } from "./Services-model"

export const getServices = async () => {
  const services = await Services.find({
    select: {
      id: true,
      serviceName: true,
      description: true,
    },
  })
  return services
}

export const createService = async (newService:any) =>{
    const serviceName: string = newService.serviceName
    const findService = await Services.findOneBy({ serviceName: serviceName })
  
   // si no existe, lo crea y no retorna nada para mandar el response en controller
    if (!findService) {
      const createdService = await Services.create(newService).save()
    } else {
      return findService
    }
}

export const updateService = () =>{

    
    
}