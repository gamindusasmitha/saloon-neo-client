import userRegistrationRequestSchema from "@/dto/userRegistrationRequest";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {

    try{

        const body = await req.json()

        //safe validation
        const validatedBody =  userRegistrationRequestSchema.safeParse(body)

        if (!validatedBody.success){
            return NextResponse.json({
                messege : validatedBody.error.issues[0].message
            },{
                status : 400
            })
        }

        const existingUser = await prisma.user.findFirst(
            {
                where : {
                    email : body.email
                }
            }
        )

        if(existingUser != null){
            return NextResponse.json(
                {
                    messege : "User already exist"
                },{
                    status : 400
                }
            )
        }

        await prisma.user.create(
            {
                data : {
                    firstName : body.firstName,
                    lastName : body.lastName,
                    email : body.email,
                    password : body.password
                }
            }
        )

        return NextResponse.json(
            {
                messege : "User created succesfully"
            }
        )
    }catch(error){
         NextResponse.json({
            messege : error 
         },
        {
            status : 500
        })
    }
    
}