import { NextResponse } from "next/server";
import { otpModel, prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Email, OTP, dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    const otpRecord = await otpModel.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP tidak valid atau sudah kadaluarsa." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password berhasil direset." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mereset password." }, { status: 500 });
  }
}
