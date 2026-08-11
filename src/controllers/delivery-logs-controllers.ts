import {Request, Response } from "express"
import {z} from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError";

class DeliveryLogsController{
    async create(req:Request, res:Response){

        const bodySchema=z.object({
            delivery_id:z.string().uuid(),
            description:z.string()
        })

        const {delivery_id, description} = bodySchema.parse(req.body)

        const delivery = await prisma.delivery.findUnique({
            where:{
                id:delivery_id
            }
        })

        if(!delivery){
            throw new AppError("delivery not found")
        }

        if(delivery.status === "processing"){
            throw new AppError("change status to shipped")
        }
        if(delivery.status === "delivered"){
            throw new AppError("this order has already been delivered")
        }

        await prisma.deliveryLog.create({
            data:{
                deliveryId:delivery_id,
                description,
            }
        })




        return res.json("ok")

    }
    async show(req:Request, res:Response){
        const paramsSchema = z.object({
            delivery_id:z.string().uuid(),
        })

        const {delivery_id} = paramsSchema.parse(req.params)

        const delivery = await prisma.delivery.findUnique({
            where:{
                id:delivery_id,
            },
            include:{
                logs:true,
                user:{select:{
                    name:true,
                    email:true,
                    role:true,
                }}
            }
        })

        if(req.user?.role === "customer" &&
            req.user.id !== delivery?.userId
        ){
            throw new AppError("User can only view their deliveries")
        }

        return res.status(200).json(delivery)
    }
    
}
export {DeliveryLogsController}