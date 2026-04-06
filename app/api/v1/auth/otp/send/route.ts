import { NextResponse } from "next/server";
import { sendOTP } from "@/app/lib/email";
import { otpModel, prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, purpose = "register" } = await req.json();

        if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (purpose === "register") {
            if (userExists) return NextResponse.json({ message: "Email already registered" }, { status: 400 });
        } else if (purpose === "forgot") {
            if (!userExists) return NextResponse.json({ message: "Email not found" }, { status: 400 });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString(); 
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await otpModel.create({
            data: { email, code, expiresAt },
        });

        await sendOTP(email, code);

        return NextResponse.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
    }
}