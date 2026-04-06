import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; 
import { setAuthCookie } from "@/app/lib/cookies";
import { signToken } from "@/app/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { message: "This account uses Google login. Please sign in with Google." },
                { status: 400 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
        });

        await setAuthCookie(token);

        return NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred during login" },
            { status: 500 }
        );
    }
}