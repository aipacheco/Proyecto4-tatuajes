import express from "express"
import * as Controller from "./controller"
import { isSuperAdmin } from "../../middlewares/isSuperAdmin"
import { auth } from "../../middlewares/auth"

const appointmentRouter = express.Router()

// endpoints de citas
appointmentRouter.get("/appointments/:id", auth, Controller.getSingleAppointment)
appointmentRouter.put("/appointments/:id", auth, Controller.updateAppointment)
appointmentRouter.get("/appointments", auth, Controller.getMyAppointments)
appointmentRouter.post("/appointments", auth, Controller.createAppointment)





export default appointmentRouter
