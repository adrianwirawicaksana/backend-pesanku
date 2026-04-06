"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Masukkan email Anda terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("Mengirim OTP...");

    try {
      const response = await fetch("/api/v1/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "forgot" }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP terkirim. Silakan cek email dan lanjutkan verifikasi.");
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
      } else {
        setMessage(data.message || "Gagal mengirim OTP.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Lupa Password</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Mengirim OTP..." : "Kirim OTP"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            padding: "10px",
            background: "#eee",
            color: "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          Kembali ke Login
        </button>

        {message && (
          <p style={{ marginTop: "20px", textAlign: "center", color: "#333" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
