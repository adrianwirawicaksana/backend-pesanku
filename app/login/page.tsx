"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("Signing in...");

        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful! Redirecting...");
                setFormData({ email: "", password: "" });

                setTimeout(() => {
                    router.push("/dashboard");
                }, 1200);
            } else {
                setMessage(data.message || "Invalid email or password");
            }
        } catch {
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
            <h1 style={{ textAlign: "center" }}>Login</h1>

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
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
                    {loading ? "Processing..." : "Login"}
                </button>
            </form>

        <div style={{ textAlign: "center", marginTop: "12px" }}>
            <a href="/forgot-password" style={{ color: "#0070f3", textDecoration: "none" }}>
                Lupa password?
            </a>
        </div>
    </div>
    );
}
