export default function DocsPage() {
    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "sans-serif", lineHeight: "1.6" }}>
            <h1>📘 Backend API Documentation</h1>

            <h2>🚀 Tech Stack</h2>
            <ul>
                <li>Next.js 16 (App Router)</li>
                <li>Prisma ORM</li>
                <li>MongoDB Atlas</li>
                <li>JWT Authentication (Cookie-based)</li>
                <li>Bcrypt (Password Hashing)</li>
            </ul>

            <hr />

            <h2>🔐 Authentication</h2>
            <p>
                Authentication menggunakan <b>JWT</b> yang disimpan di <b>HttpOnly Cookie</b>.
            </p>

            <h3>📌 Register</h3>
            <pre>
{`POST /api/v1/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "otp": "123456"
}

Response:
{
  "message": "User registered successfully",
  "token": "..."
}`}
            </pre>

            <h3>📌 Login</h3>
            <pre>
{`POST /api/v1/auth/login

Body:
{
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "message": "Login successful",
  "token": "..."
}

Note:
- Server menyimpan JWT ke HttpOnly cookie melalui setAuthCookie
- Response juga mengembalikan token untuk debugging jika diperlukan`}
            </pre>

            <h3>📌 Login with Google</h3>
            <pre>
{`POST /api/v1/auth/google

Body:
{
  "id_token": "GOOGLE_ID_TOKEN"
}

Response:
{
  "message": "Login with Google successful",
  "token": "...",
  "user": { ... }
}`}
            </pre>

            <h3>📌 Logout</h3>
            <pre>
{`POST /api/v1/auth/logout

Response:
{
  "message": "Logout berhasil"
}

Behavior:
- Cookie token dihapus
- User tidak lagi dianggap authenticated`}
            </pre>

            <hr />

            <h2>🔐 OTP Flow</h2>
            <h3>Send OTP</h3>
            <pre>
{`POST /api/v1/auth/otp/send

Body:
{
  "email": "user@example.com",
  "purpose": "register"   // atau "forgot"
}

Response:
{
  "message": "OTP sent successfully"
}

Notes:
- purpose == "register": hanya untuk email yang belum terdaftar
- purpose == "forgot": hanya untuk email yang sudah terdaftar`}
            </pre>

            <h3>Verify OTP</h3>
            <pre>
{`POST /api/v1/auth/otp/verify

Body:
{
  "email": "user@example.com",
  "code": "123456"
}

Response:
{
  "message": "OTP valid"
}

Error:
- OTP salah → 400
- OTP kadaluarsa → 400`}
            </pre>

            <h3>Forgot Password</h3>
            <pre>
{`POST /api/v1/auth/forgot

Body:
{
  "email": "user@example.com",
  "code": "123456",
  "password": "newpassword123"
}

Response:
{
  "message": "Password berhasil direset."
}

Notes:
- OTP harus valid dan belum kadaluarsa
- Password akan di-hash sebelum disimpan`}
            </pre>

            <hr />

            <h2>🔒 Protected Page (Middleware)</h2>
            <p>
                Halaman tertentu dilindungi menggunakan middleware berbasis cookie.
            </p>

            <pre>
{`Protected Route:
GET /dashboard

Behavior:
- Jika tidak ada token → redirect ke /login
- Jika ada token → akses diizinkan`}
            </pre>

            <hr />

            <h2>⚙️ Cara Kerja Authentication</h2>
            <ul>
                <li>User register → data disimpan ke database (MongoDB)</li>
                <li>User login → server generate JWT</li>
                <li>JWT disimpan di HttpOnly Cookie</li>
                <li>Setiap request → cookie otomatis dikirim ke server</li>
                <li>Middleware cek token untuk akses halaman</li>
                <li>Logout → cookie dihapus</li>
            </ul>

            <hr />

            <h2>🌐 Base URL</h2>
            <pre>{process.env.BASE_URL}</pre>

            <hr />

            <h2>⚠️ Notes untuk Frontend</h2>

            <h4>Jika menggunakan cookie (RECOMMENDED)</h4>
            <pre>
{`fetch("/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
  body: JSON.stringify({
    email: "john@example.com",
    password: "123456"
  })
});`}
            </pre>

            <h4>Request ke halaman yang dilindungi</h4>
            <pre>
{`fetch("/dashboard", {
  credentials: "include"
});`}
            </pre>

            <hr />

            <h2>✅ Status Code</h2>
            <ul>
                <li>200 → Success</li>
                <li>201 → Created</li>
                <li>400 → Bad Request</li>
                <li>401 → Unauthorized</li>
                <li>500 → Server Error</li>
            </ul>

            <hr />

            <p style={{ marginTop: "40px", color: "gray" }}>
                © Backend API - Next.js + Prisma + MongoDB
            </p>
        </div>
    );
}
