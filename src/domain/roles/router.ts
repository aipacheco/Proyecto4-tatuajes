import express from "express"
import * as Controller from "./controller"

const roleRouter = express.Router()

// endpoint de creación de rol
roleRouter.post("/roles", Controller.createRole)

export default roleRouter
