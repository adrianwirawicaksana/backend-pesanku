import LogoutButton from "@/app/components/LogoutButton";

export default function DashboardPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard Bre!</h1>
        <LogoutButton />
      </header>
      
      <hr style={{ margin: "20px 0" }} />
      
      <main>
        <div style={{ padding: "20px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
          <p>✅ <b>Sesi Aktif:</b> Kamu berhasil masuk menggunakan JWT Cookie.</p>
          <p>Middleware sekarang menjaga pintu halaman ini.</p>
        </div>
      </main>
    </div>
  );
}