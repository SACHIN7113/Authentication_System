import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTES } from "../routes/paths.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      setForm({ email: "", password: "" });
      navigate(ROUTES.PROFILE);
    } catch (err) {
      const message = err?.response?.data?.detail || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="absolute -left-20 top-24 h-60 w-60 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="absolute -right-14 bottom-24 h-52 w-52 rounded-full bg-blue-200/60 blur-3xl" />

      <section className="fade-up mx-auto grid min-h-[88vh] w-full max-w-5xl items-center gap-6 md:grid-cols-2">
        <article className="hidden md:block">
          <p className="mb-3 inline-block rounded-full border border-slate-300/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            JWT Authentication
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            Welcome Back to Your Secure Workspace
          </h1>
          <p className="mt-4 max-w-md text-slate-700">
            Sign in to access your profile securely with token-based authentication and protected
            routes.
          </p>
        </article>

        <div className="glass-panel w-full rounded-3xl p-8 shadow-xl shadow-slate-900/10">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">Sign In</h2>
          <p className="mb-6 text-sm text-slate-700">Welcome back. Please log in to continue.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 pr-11 outline-none transition focus:border-cyan-500"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-[34px] rounded-md p-1 text-slate-600 transition hover:bg-slate-100"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-700">
            Do not have an account?{" "}
            <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to={ROUTES.REGISTER}>
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
