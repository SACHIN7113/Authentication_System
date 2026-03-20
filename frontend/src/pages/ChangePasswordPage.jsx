import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTES } from "../routes/paths.jsx";


const STRONG_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.new_password !== form.confirm_password) {
      setError("New password and confirm password must match.");
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(form.new_password)) {
      setError(
        "New password must be at least 6 characters and include one uppercase letter, one number, and one special character."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await updatePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setSuccess(response.message || "Password updated successfully.");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => navigate(ROUTES.PROFILE), 900);
    } catch (err) {
      const message = err?.response?.data?.detail || "Unable to change password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="absolute -left-12 top-16 h-56 w-56 rounded-full bg-orange-200/60 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />

      <section className="fade-up mx-auto max-w-2xl">
        <div className="glass-panel rounded-3xl p-8 shadow-xl shadow-slate-900/10">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
            <Link
              to={ROUTES.PROFILE}
              className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Profile
            </Link>
          </div>

          <p className="mb-6 text-slate-700">
            Update your account password. Use a strong password with at least 6 characters.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="current_password">
                Current Password
              </label>
              <input
                id="current_password"
                name="current_password"
                type={showCurrentPassword ? "text" : "password"}
                value={form.current_password}
                onChange={handleChange}
                minLength={6}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 pr-11 outline-none transition focus:border-orange-500"
              />
              <button
                type="button"
                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                onClick={() => setShowCurrentPassword((previous) => !previous)}
                className="absolute right-3 top-[34px] rounded-md p-1 text-slate-600 transition hover:bg-slate-100"
              >
                {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="new_password">
                New Password
              </label>
              <input
                id="new_password"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                value={form.new_password}
                onChange={handleChange}
                minLength={6}
                pattern="^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$"
                title="At least 6 characters, one uppercase letter, one number, and one special character."
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 pr-11 outline-none transition focus:border-orange-500"
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute right-3 top-[34px] rounded-md p-1 text-slate-600 transition hover:bg-slate-100"
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="confirm_password">
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirm_password}
                onChange={handleChange}
                minLength={6}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 pr-11 outline-none transition focus:border-orange-500"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute right-3 top-[34px] rounded-md p-1 text-slate-600 transition hover:bg-slate-100"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
