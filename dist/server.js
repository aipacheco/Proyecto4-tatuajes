"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./models/db");
const app_1 = require("./app");
const PORT = process.env.PORT || 4001;
db_1.AppDataSource.initialize()
    .then(() => {
    console.log("database conected");
    app_1.app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
})
    .catch((error) => console.log(error));
