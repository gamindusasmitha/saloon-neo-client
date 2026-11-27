import userAuthnticationRequestSchema from "@/dto/userAuthenticationRequest";
import prisma from "@/lib/prisma";
import { Status } from "@/app/generated/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"

export async function POST(request:NextRequest) {

    try{
        const body = await request.json()

        //safe validation
        const AuthenticatedBody =  userAuthnticationRequestSchema.safeParse(body)

        if(!AuthenticatedBody.success){

            return NextResponse.json(
                {
                    message : AuthenticatedBody.error.issues[0].message
                },{
                    status : 400
                }
            )
        }

        const user = await prisma.user.findUnique(
            {
                where : {
                    email : AuthenticatedBody.data.email
                }
            }
        )

        if(user == null || !(await bcrypt.compare(AuthenticatedBody.data.password, user.password))){
            return NextResponse.json(
                {
                    message : "Invalid email or password"
                },{
                    status : 401
                }
            )
        }

        if(user.status != Status.ACTIVE){
            return NextResponse.json(
                {
                    message : "User account is not active"
                },{
                    status : 403
                }
            )
        }

        const userInformation = {
            id : user.id,
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            role :user.role,
            image : user.image,
            permission : user.permissions
        }

        const signature = process.env.JOSE_JWT_SECRET

        const signatureEncoded = new TextEncoder().encode(signature)

        const token = await new jose.SignJWT(userInformation).setProtectedHeader({alg : "HS256"}).setExpirationTime("48h").sign(signatureEncoded)

        const response = NextResponse.json(
            {
                message : "Login successful"
            }
        )

        response.cookies.set(
            {
                name : "auth-token",
                value : token,
                httpOnly : true,
                secure : process.env.NODE_ENV === "production",
                sameSite : "lax",
                maxAge : 60*60*24*2  //2days
            }
        )

        return response

    }catch(error){

        console.error(error)

        return NextResponse.json(
            {
                message : "Request not success"

            },{
                status : 500
            }
        )
    }
}
