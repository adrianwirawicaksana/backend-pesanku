"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter your email to receive OTP");
      return;
    }

    setLoading(true);
    setMessage("Sending OTP...");

    try {
      const response = await fetch("/api/v1/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, purpose: "register" }),
      });

      const data = await response.json();
      setMessage(response.ok ? "OTP sent. Check your email." : data.message || "Failed to send OTP");
    } catch (error) {
      setMessage("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp) {
      setMessage("Please enter the OTP sent to your email");
      return;
    }

    setLoading(true);
    setMessage("Verifying OTP...");

    try {
      const verifyResponse = await fetch("/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: formData.otp }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        setMessage(verifyData.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      setMessage("Creating account...");
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting...");
        setFormData({ name: "", email: "", password: "", otp: "" });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setMessage(data.message || "Google login failed");
      }
    } catch {
      setMessage("Google login error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Create Account</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          style={{ padding: "10px" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          style={{ padding: "10px" }}
        />

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={loading || !formData.email}
          style={{
            padding: "10px",
            background: loading ? "#999" : "#555",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="OTP Code"
          value={formData.otp}
          onChange={(e) =>
            setFormData({ ...formData, otp: e.target.value })
          }
          required
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          style={{ padding: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <span>or</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setMessage("Google login failed")}
        />
      </div>

      {message && (
        <p style={{ marginTop: "20px", textAlign: "center", color: "#333" }}>
          {message}
        </p>
      )}
    </div>
  );
}