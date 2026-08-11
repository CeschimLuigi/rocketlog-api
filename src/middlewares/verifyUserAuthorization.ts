import {Request, Response, NextFunction, request} from "express"
import {AppError} from "@/utils/AppError"

function verifyUserAuthorization(role:string[]){
    return (req:Request, res:Response, next:NextFunction) =>{
        if(!req.user){
            throw new AppError("unauthorized",401)
        }

        if(!role.includes(req.user.role)){
            throw new AppError("unauthorized",401)
        }

        return next()
    }
}

export {verifyUserAuthorization}
