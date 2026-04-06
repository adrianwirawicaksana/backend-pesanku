"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (!confirm("Yakin mau keluar, Bre?")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/v1/auth/logout", {
                method: "POST",
            });

            if (res.ok) {
                router.refresh();
                router.push("/login");
            } else {
                alert("Gagal logout, coba lagi.");
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            style={{
                padding: "10px 20px",
                backgroundColor: loading ? "#64748b" : "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold"
            }}
        >
            {loading ? "Sedang Keluar..." : "Logout"}
        </button>
    );
}