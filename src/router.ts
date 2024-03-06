import  {  Router } from "express"
import appointmentRouter from "./domain/appointments/router"
import authRouter from "./domain/users/auth/router"
import roleRouter from "./domain/roles/router"
import serviceRouter from "./domain/services/router"
import userRouter from "./domain/users/router"


const router = Router()
//rutas de roles
router.use("/", roleRouter)
//rutas de auth
router.use("/auth", authRouter)
//rutas de user
router.use("/", userRouter)
//rutas de services
router.use("/", serviceRouter)
//rutas de appointments
router.use("/", appointmentRouter)


export default router