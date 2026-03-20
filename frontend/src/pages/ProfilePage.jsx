import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTES } from "../routes/paths.jsx";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { loadProfile, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await loadProfile();
        setProfile(response.user);
      } catch (err) {
        const message = err?.response?.data?.detail || "Unable to fetch profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    signOut();
    navigate(ROUTES.LOGIN);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-lg font-medium text-slate-700">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8">
      <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl" />

      <section className="fade-up mx-auto max-w-3xl">
        <div className="glass-panel rounded-3xl p-8 shadow-xl shadow-slate-900/10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Profile Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Authenticated
              </span>
              <Link
                to={ROUTES.PROFILE}
                className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          <p className="mb-6 text-slate-700">
            Protected route verified. User data below is fetched using your JWT access token.
          </p>

          {error && <p className="mb-4 text-red-600">{error}</p>}

          {profile && (
            <div className="grid gap-5 rounded-2xl border border-slate-300/70 bg-white/70 p-5">
              <div className="grid gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
                  <p className="font-medium text-slate-800 break-all">{profile.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                  <p className="font-medium text-slate-800">{profile.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                  <p className="font-medium text-slate-800">{profile.email}</p>
                </div>
              </div>
              <div className="pt-1">
                <Link
                  to={ROUTES.CHANGE_PASSWORD}
                  className="inline-flex rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  Change Password
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
