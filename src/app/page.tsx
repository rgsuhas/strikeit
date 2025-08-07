"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleEnt = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim()}`);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#0d0d0d", // darker black
        color: "#f1f1f1", // brighter text
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
          strikeit
        </h1>
        <div style={{ fontSize: 20, color: "#aaa", marginBottom: 32 }}>
Share To-Do lists online: the easy way   </div>
        <form
          onSubmit={handleEnt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: 7,
              padding: "8px 12px",
              fontSize: 16,
              color: "#aaa",
            }}
          >
            rg-strikeit.vercel.app/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="your-secret-listp"
            style={{
              padding: "8px 12px",
              fontSize: 16,
              border: "1px solid #555",
              borderRadius: 4,
              width: 200,
              background: "#111",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 18px",
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #666",
              background: "#222",
              color: "#eee",
              cursor: "pointer",
            }}
          >
            ⇧
          </button>
        </form>
        <div style={{ color: "#777", fontSize: 15, marginBottom: 32 }}>
          No login needed 
        </div>
      </main>
      <footer
        style={{
          fontSize: 13,
          color: "#666",
          marginBottom: 16,
          display: "flex",
          gap: 16,
        }}
      >
        {/* Optional Footer Links */}
        {/* <Link href="#">Privacy Policy</Link>
        <span>|</span>
        <Link href="#">Cookie Policy</Link>
        <span>|</span>
        <Link href="#">Content Policy</Link> */}
        <span style={{ marginLeft: 16 }}>&copy; 2025 strikeit</span>
      </footer>
    </div>
  );
}