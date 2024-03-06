import express from "express"
import * as Controller from "./controller"

const authRouter = express.Router()

// endpoint de creación de usuario
authRouter.post("/register", Controller.register)
authRouter.post("/login", Controller.login)

export default authRouter
