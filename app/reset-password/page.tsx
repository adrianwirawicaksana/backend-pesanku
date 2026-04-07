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
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const getCookieValue = (name: string) => {
    const match = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${name}=`));
    return match?.split("=")[1] ?? null;
  };

  useEffect(() => {
    const cookieValue = getCookieValue("forgotPassword");
    if (!cookieValue) {
      router.replace("/forgot-password");
      setChecking(false);
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(cookieValue)) as ForgotPasswordData;
      if (!parsed.email || !parsed.otp) {
        document.cookie = "forgotPassword=; Path=/; Max-Age=0";
        router.replace("/forgot-password");
        return;
      }
      setForgotData(parsed);
    } catch {
      document.cookie = "forgotPassword=; Path=/; Max-Age=0";
      router.replace("/forgot-password");
      return;
    } finally {
      setChecking(false);
    }
  }, [router]);

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
        document.cookie = "forgotPassword=; Path=/; Max-Age=0";
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

  if (checking) {
    return (
      <div style={{ maxWidth: "400px", margin: "60px auto", fontFamily: "sans-serif", textAlign: "center" }}>
        <p>Memeriksa akses...</p>
      </div>
    );
  }

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
