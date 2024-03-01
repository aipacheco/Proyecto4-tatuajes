import express, { Application } from "express"
import dotenv from "dotenv"
dotenv.config()
import { AppDataSource } from "./models/db"
import roleRouter from "./domain/roles/router"
import authRouter from "./domain/auth/router"
import userRouter from "./domain/users/router"


export const app: Application = express()

app.use(express.json()) //para convertir a json los datos recibidos

app.get("/hello", (req, res) => {
  res.status(200).json({ success: true, msg: "server is ok" })
})

const PORT = process.env.PORT || 4001

//rutas de roles
app.use('/api', roleRouter);

//rutas de auth
app.use('/api', authRouter);

//rutas de user
app.use('/api', userRouter);


AppDataSource.initialize()
  .then(() => {
    console.log("database conected")
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
  })
  .catch((error) => console.log(error))
