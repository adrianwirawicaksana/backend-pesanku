import { NextResponse } from "next/server";
import { otpModel } from "@/app/lib/prisma";

export async function POST(request: Request) {
    const { email, code } = await request.json();

    const otpRecord = await otpModel.findFirst({
        where: { email, code },
        orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) return NextResponse.json({ message: "OTP salah" }, { status: 400 });
    if (otpRecord.expiresAt < new Date()) return NextResponse.json({ message: "OTP kadaluarsa" }, { status: 400 });

    const response = NextResponse.json({ message: "OTP valid" });
    response.cookies.set("forgotPassword", JSON.stringify({ email, otp: code }), {
        path: "/",
        maxAge: 300,
        sameSite: "lax",
    });

    return response;
}