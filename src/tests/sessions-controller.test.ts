import request from "supertest"
import { app } from "@/app";
import { prisma } from "@/database/prisma";

const testEmail = "authuser@gmail.com"
let user_id: string

describe("SessionsController", ()=>{

    beforeAll(async ()=>{
        await prisma.user.deleteMany({ where: { email: testEmail } })
    })

    afterAll(async ()=>{
        await prisma.user.delete({ where: { id: user_id } })
    })

    it("should authenticate and get access token", async ()=>{
        const userResponse = await request(app).post("/users").send({
            name:"Auth User",
            email:testEmail,
            password:"password123"
        })

        expect(userResponse.status).toBe(201)

        user_id = userResponse.body.userWithOutPassword.id

        const sessionResponse = await request(app).post("/sessions").send({
            email:testEmail,
            password:"password123"
        })

        expect(sessionResponse.status).toBe(201)
        expect(sessionResponse.body.token).toEqual(expect.any(String))

    })


})