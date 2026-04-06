"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type VerifyFormProps = {
  initialEmail?: string;
};

export default function VerifyForm({ initialEmail = "" }: VerifyFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setMessage("Email dan OTP wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("Memverifikasi OTP...");

    try {
      const response = await fetch("/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("forgotPassword", JSON.stringify({ email, otp }));
        router.push("/reset-password");
      } else {
        setMessage(data.message || "OTP tidak valid.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Verifikasi OTP</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="text"
          placeholder="Kode OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Memverifikasi..." : "Verifikasi OTP"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          style={{
            padding: "10px",
            background: "#eee",
            color: "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          Kembali ke Kirim OTP
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
