"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Impor useRouter untuk redirect
import React, { useState } from "react";

export default function Login() {
  const router = useRouter();
  // State untuk input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true); // Mulai loading
    setError(null); // Reset error sebelumnya

    try {
      const result = await signIn("credentials", {
        redirect: false, // Biarkan kita yang handle redirect
        email: email,
        password: password,
        callbackUrl: "/dashboard",
      });

      // Cek hasil dari signIn
      if (result?.error) {
        // Jika ada error, tampilkan pesannya
        setError(result.error);
      } else if (result?.url) {
        // Jika berhasil dan ada URL, arahkan pengguna
        router.push(result.url);
      }
    } catch (err) {
      // Tangani error tak terduga
      setError("Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.");
    } finally {
      setIsLoading(false); // Hentikan loading, baik berhasil maupun gagal
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>Form Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Sedang Masuk..." : "Login"}
        </button>
      </form>
    </div>
  );
}
