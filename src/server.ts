import express, { Application } from "express"
import dotenv from "dotenv"
dotenv.config()
import { AppDataSource } from "./models/db"
import  {createRole } from "./domain/roles/router"

export const app: Application = express()

app.use(express.json()) //para convertir a json los datos recibidos

app.get("/hello", (req, res) => {
  res.status(200).json({ success: true, msg: "server is ok" })
})

const PORT = process.env.PORT || 4001

app.post("/roles", createRole)

AppDataSource.initialize()
  .then(() => {
    console.log("database conected")
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
  })
  .catch((error) => console.log(error))
