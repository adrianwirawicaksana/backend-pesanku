import { NextResponse } from "next/server";
import { otpModel, prisma } from "@/app/lib/prisma";
import { setAuthCookie } from "@/app/lib/cookies";
import { signToken } from "@/app/lib/jwt";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const { name, email, password, otp } = await request.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        if (!otp) {
            return NextResponse.json({ message: "OTP is required" }, { status: 400 });
        }

        const otpRecord = await otpModel.findFirst({
            where: { email, code: otp },
            orderBy: { createdAt: "desc" },
        });

        if (!otpRecord || otpRecord.expiresAt < new Date())
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        });

        const token = signToken({ userId: user.id, email: user.email })

        await setAuthCookie(token);

        return NextResponse.json({ message: "User registered successfully", token }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}
