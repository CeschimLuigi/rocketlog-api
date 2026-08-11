import {Request, Response } from "express"
import {z} from "zod"
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError";

class UserController{

    async create(req:Request, res:Response){

        const bodySchema = z.object({
            name:z.string().trim().min(3),
            email:z.string().email(),
            password:z.string().min(6),
        })

        const {name, email, password} = bodySchema.parse(req.body)


        const userWithSameEmail = await prisma.user.findFirst({where:{email}})

        if(userWithSameEmail){
            throw new AppError("user with same email already exists")
        }

        const hashedPassword = await hash(password,8)

        const user = await prisma.user.create({data:{
            name,
            email,
            password:hashedPassword,
        }})

        const{password:_, ...userWithOutPassword} = user


        

        


        res.status(201).json({userWithOutPassword})
    }

}

export {UserController}