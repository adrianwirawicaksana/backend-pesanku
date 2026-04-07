import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '@/app/lib/prisma'
import { signToken } from '@/app/lib/jwt'
import { setAuthCookie } from '@/app/lib/cookies'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: NextRequest) {
    try {
        const { id_token } = await req.json()

        if (!id_token) {
            return NextResponse.json(
                { message: 'ID token is required' },
                { status: 400 }
            )
        }

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()

        if (!payload || !payload.email) {
            return NextResponse.json(
                { message: 'Invalid Google token' },
                { status: 401 }
            )
        }

        const { email, name, picture, sub } = payload

        let user = await prisma.user.findUnique({
            where: { email },
        })

        if (user && !user.googleId) {
            user = await prisma.user.update({
                where: { email },
                data: {
                    googleId: sub,
                    picture,
                    provider: user.password ? 'both' : 'google',
                },
            })
        } else if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    picture,
                    googleId: sub,
                    provider: 'google',
                },
            })
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
        })

        await setAuthCookie(token)

        return NextResponse.json(
            {
                message: 'Login with Google successful',
                token,
                user,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Google authentication failed' },
            { status: 500 }
        )
    }
}