import {Request, Response } from "express"
import {z} from "zod"
import { prisma } from "@/database/prisma"


class DeliveriesStatusController{
    async create(req:Request, res:Response){
        const bodySchema= z.object({
            status: z.enum(["processing", "shipped", "delivered"]),
        })

        const { id } = req.params
        const { status } = bodySchema.parse(req.body)

        await prisma.delivery.update({data:{
            status:status
            
        },
        where:{
            id,
        }
    })

    await prisma.deliveryLog.create({data:{
        deliveryId:id,
        description:status
    }})

    return res.status(200).json({message:`status was updated to: ${status}`})
    }
}

export{DeliveriesStatusController}