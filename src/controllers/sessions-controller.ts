
import {Request, Response } from "express"
import {z} from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import {compare} from "bcrypt"
import {authConfig} from "@/config/auth"
import{sign} from "jsonwebtoken"


class SessionsController{

    async create(req:Request,res:Response){

        const bodySchema = z.object({
            email: z.string().email(),
            password:z.string().min(6)
        })

        const {email, password } = bodySchema.parse(req.body)

        const user = await prisma.user.findFirst({
            where:{
                email
            }
        })

        if(!user){
            throw new AppError("invalid email or password", 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError("invalid email or password", 401)
        }
        const {secret, expiresIn } = authConfig.jwt

        const token = sign({role:user.role ?? "customer"}, secret, {
            expiresIn,
            subject:user.id
        })

        const{password: hashedPassword, ...userWithOutPassword} = user

        




        
        return res.status(201).json({token,user:userWithOutPassword})

    }



}

export {SessionsController}