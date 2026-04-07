import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];
const resetPasswordRoutes = ["/reset-password"];

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://pesankuapp.vercel.app",
  "https://backend-pesankuapp.vercel.app",
];

function isOriginAllowed(origin: string): boolean {
  return allowedOrigins.some((allowed) => {
    if (allowed.includes("*")) {
      const pattern = allowed.replace("*", ".*");
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return origin === allowed;
  });
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const resetPasswordCookie = request.cookies.get("forgotPassword")?.value;
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin") || "";

  // Handle CORS untuk API routes
  if (pathname.startsWith("/api/")) {
    const corsHeaders = new Headers();

    if (isOriginAllowed(origin)) {
      corsHeaders.set("Access-Control-Allow-Origin", origin);
      corsHeaders.set("Access-Control-Allow-Credentials", "true");
      corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      corsHeaders.set("Access-Control-Max-Age", "86400");
    }

    // ✅ OPTIONS preflight → langsung balas 204
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // ✅ Request biasa → inject CORS headers ke response
    const response = NextResponse.next();
    corsHeaders.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token === "") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (resetPasswordRoutes.some((route) => pathname.startsWith(route))) {
    if (!resetPasswordCookie) {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token && token !== "") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/reset-password", "/api/:path*"],
};