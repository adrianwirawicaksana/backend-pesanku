import { NextResponse } from "next/server";

const spec = {
    openapi: "3.0.0",
    info: {
        title: "PesanKu App API",
        version: "1.0.0",
        description: "Backend API — Next.js 16 · Prisma ORM · MongoDB Atlas · JWT (HttpOnly Cookie)",
    },
    servers: [
        { url: "https://backend-pesankuapp.vercel.app", description: "Production" },
        { url: "http://localhost:3000", description: "Local" },
    ],
    components: {
        securitySchemes: {
            cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
        },
        schemas: {
            RegisterBody: {
                type: "object",
                required: ["name", "email", "password", "otp"],
                properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", example: "123456" },
                    otp: { type: "string", example: "123456" },
                },
            },
            LoginBody: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", example: "123456" },
                },
            },
            GoogleBody: {
                type: "object",
                required: ["id_token"],
                properties: {
                    id_token: { type: "string", example: "GOOGLE_ID_TOKEN" },
                },
            },
            OtpSendBody: {
                type: "object",
                required: ["email", "purpose"],
                properties: {
                    email: { type: "string", format: "email", example: "user@example.com" },
                    purpose: { type: "string", enum: ["register", "forgot"], example: "register" },
                },
            },
            OtpVerifyBody: {
                type: "object",
                required: ["email", "code"],
                properties: {
                    email: { type: "string", format: "email", example: "user@example.com" },
                    code: { type: "string", example: "123456" },
                },
            },
            ForgotBody: {
                type: "object",
                required: ["email", "code", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "user@example.com" },
                    code: { type: "string", example: "123456" },
                    password: { type: "string", example: "newpassword123" },
                },
            },
            TokenResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                },
            },
            MessageResponse: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    message: { type: "string", example: "OTP salah atau kadaluarsa" },
                },
            },
        },
    },
    tags: [
        { name: "Auth", description: "Register, Login, Logout, Google OAuth" },
        { name: "OTP", description: "Send OTP, Verify OTP, Forgot Password" },
        { name: "Protected", description: "Protected routes (require auth cookie)" },
    ],
    paths: {
        "/api/v1/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register user baru",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } },
                },
                responses: {
                    "201": { description: "User berhasil didaftarkan", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } },
                    "400": { description: "Bad Request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/api/v1/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login dengan email & password",
                description: "Server menyimpan JWT ke HttpOnly cookie. Response juga mengembalikan token untuk debugging.",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
                },
                responses: {
                    "200": { description: "Login berhasil", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } },
                    "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/api/v1/auth/google": {
            post: {
                tags: ["Auth"],
                summary: "Login dengan Google OAuth",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/GoogleBody" } } },
                },
                responses: {
                    "200": {
                        description: "Login Google berhasil",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        token: { type: "string" },
                                        user: { type: "object" },
                                    },
                                },
                            },
                        },
                    },
                    "400": { description: "Token tidak valid", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/api/v1/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout — hapus cookie",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": { description: "Logout berhasil, cookie token dihapus", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
                },
            },
        },
        "/api/v1/auth/otp/send": {
            post: {
                tags: ["OTP"],
                summary: "Kirim OTP ke email",
                description: "`register` — hanya untuk email yang belum terdaftar.\n`forgot` — hanya untuk email yang sudah terdaftar.",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/OtpSendBody" } } },
                },
                responses: {
                    "200": { description: "OTP berhasil dikirim", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
                    "400": { description: "Email tidak sesuai purpose", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/api/v1/auth/otp/verify": {
            post: {
                tags: ["OTP"],
                summary: "Verifikasi kode OTP",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/OtpVerifyBody" } } },
                },
                responses: {
                    "200": { description: "OTP valid", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
                    "400": { description: "OTP salah atau kadaluarsa", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/api/v1/auth/forgot": {
            post: {
                tags: ["OTP"],
                summary: "Reset password via OTP",
                description: "OTP harus valid dan belum kadaluarsa. Password akan di-hash sebelum disimpan.",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotBody" } } },
                },
                responses: {
                    "200": { description: "Password berhasil direset", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
                    "400": { description: "OTP tidak valid", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
                },
            },
        },
        "/dashboard": {
            get: {
                tags: ["Protected"],
                summary: "Halaman dashboard (protected)",
                security: [{ cookieAuth: [] }],
                description: "Redirect ke /login jika tidak ada token cookie.",
                responses: {
                    "200": { description: "Akses diizinkan" },
                    "302": { description: "Redirect ke /login" },
                },
            },
        },
        "/reset-password": {
            get: {
                tags: ["Protected"],
                summary: "Halaman reset password (protected)",
                description: "Memerlukan cookie sementara forgotPassword. Redirect ke /forgot-password jika cookie tidak ada.",
                responses: {
                    "200": { description: "Akses diizinkan" },
                    "302": { description: "Redirect ke /forgot-password" },
                },
            },
        },
    },
};

export function GET() {
    return NextResponse.json(spec);
}