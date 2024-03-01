import { NextFunction, Request, Response } from "express";

export const isSuperAdmin = (req:Request, res: Response, next: NextFunction) =>{

    try {
        if(req.tokenData.userRole !== "super_admin"){
           return res.status(401).json({
                success: false,
                error: "Unauthorized",
              })
        }

        next()
    } catch (error) {
        console.log(error)
    }

}