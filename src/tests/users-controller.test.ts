import { app } from "@/app";
import { prisma } from "@/database/prisma";
import request from "supertest"


describe("usersController", ()=> {
    let userResponse:any
    let userResponseId:string

    afterAll(async ()=>{
        await prisma.user.delete({ where:{id:userResponseId}})
    })

    it("should create a new user sucessfully", async ()=>{
        const response = await request(app).post("/users").send({
            name:"Test User",
            email:"testuser@gmail.com",
            password:"password123"
        })

        userResponse = response.body.userWithOutPassword
        userResponseId = response.body.userWithOutPassword.id
        
        expect(response.status).toBe(201)
        expect(userResponse.name).toBe("Test User")
        expect(userResponse).toHaveProperty("id")
        
    })

    it("shoud throw an error if user with same email already exists", async ()=>{
         const response = await request(app).post("/users").send({
            name:"DUPLICATE User",
            email:"testuser@gmail.com",
            password:"password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("user with same email already exists")
    })

    it("should throw a validation error if email is invalid", async ()=>{
        const response = await request(app).post("/users").send({
            name:"Test User",
            email:"invalid email",
            password:"password123"
        })


        expect(response.body.message).toBe("Validation Error")

    } )

})