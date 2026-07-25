"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // Disimpan ke raw_user_meta_data, nanti trigger SQL memasukkannya ke public.users
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Jika Supabase dikonfigurasi untuk butuh verifikasi email:
    // User akan berhasil dibuat, tapi sesi (session) bernilai null.
    if (data.user && data.session === null) {
      setSuccess(
        "Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk melakukan verifikasi sebelum bisa login."
      );
      setLoading(false);
      return;
    }

    // Jika auto-login menyala (tanpa konfirmasi email)
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-paper p-8 shadow-sm">
        <h1 className="mb-2 font-serif text-3xl font-bold text-ink">
          Daftar Aura
        </h1>
        <p className="mb-6 text-sm text-muted-text">
          Buat akun untuk mulai mencari ide penelitian.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded border border-sage-dark bg-sage p-3 text-sm text-paper font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-ink-soft"
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-border-soft bg-transparent px-3 py-2 text-ink focus:border-ink focus:outline-none"
              placeholder="Budi Santoso"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-ink-soft"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border-soft bg-transparent px-3 py-2 text-ink focus:border-ink focus:outline-none"
              placeholder="budi@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-ink-soft"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-border-soft bg-transparent px-3 py-2 pr-10 text-ink focus:border-ink focus:outline-none"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-50"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-text">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-ink hover:underline font-medium">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
