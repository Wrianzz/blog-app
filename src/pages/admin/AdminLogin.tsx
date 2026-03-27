import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/admin/posts", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login gagal");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-gray-400 mb-6">
          Masuk untuk mengelola blog post.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-white text-black py-3 font-medium"
          >
            Login
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}