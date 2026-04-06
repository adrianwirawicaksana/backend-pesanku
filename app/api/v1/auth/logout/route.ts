import { deleteAuthCookie } from "@/app/lib/cookies";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await deleteAuthCookie(); 
        return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Gagal logout" }, { status: 500 });
    }
}