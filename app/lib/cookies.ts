import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24,
    })
}

export async function deleteAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}