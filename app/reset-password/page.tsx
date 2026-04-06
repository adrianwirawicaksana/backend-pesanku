"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ForgotPasswordData = {
  email: string;
  otp: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [forgotData, setForgotData] = useState<ForgotPasswordData | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("forgotPassword");
    if (stored) {
      setForgotData(JSON.parse(stored));
    }
  }, []);

  const handleResetPassword = async () => {
    if (!forgotData) {
      setMessage("Silakan kembali ke halaman verifikasi OTP terlebih dahulu.");
      return;
    }

    if (!password || !confirmPassword) {
      setMessage("Semua bidang wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setMessage("Menyimpan password baru...");

    try {
      const response = await fetch("/api/v1/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotData.email,
          code: forgotData.otp,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.removeItem("forgotPassword");
        setMessage("Password berhasil diperbarui. Mengarahkan ke login...");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        setMessage(data.message || "Gagal menyimpan password baru.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Reset Password</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
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
