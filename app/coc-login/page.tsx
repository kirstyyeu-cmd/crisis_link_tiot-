"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AUTHORISED_USERS = [
  { username: "undp.staff1", password: "COC@2026#One"   },
  { username: "undp.staff2", password: "COC@2026#Two"   },
  { username: "undp.staff3", password: "COC@2026#Three" },
];

export default function COCLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const user = AUTHORISED_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // TODO: replace with real JWT auth from backend
      localStorage.setItem('coc_user', JSON.stringify({ username: user.username }));
      router.push('/coc');
    } else {
      setError('Access denied. Invalid credentials or unauthorised user.');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-blue-950 flex flex-col items-center justify-center p-4 font-sans">

      {/* Restricted access notice */}
      <div className="w-full max-w-sm mb-4 bg-orange-600/20 border border-orange-500/40 rounded-2xl px-5 py-3 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div>
          <p className="text-orange-400 font-black text-xs uppercase tracking-wide">
            Restricted Access
          </p>
          <p className="text-orange-200/70 text-xs font-medium mt-0.5 leading-relaxed">
            This portal is for authorised UNDP staff only. Unauthorised access is strictly prohibited.
          </p>
        </div>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-900 px-6 pt-8 pb-7 text-center relative">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-900 text-xs leading-tight text-center shadow">
                UN<br />DP
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-white font-black text-xl uppercase tracking-tight">
              Crisis Operations Centre
            </h1>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">
              UNDP Staff Portal
            </p>
          </div>
        </div>

        {/* Orange gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600" />

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 py-8 space-y-5 bg-white">

          {/* Username */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 tracking-wider">
              Staff Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your username"
              className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full p-3.5 pr-16 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-black uppercase transition-colors"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-xs font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-black uppercase text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Access Portal
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">
              Not staff?
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          {/* Community redirect */}
          <Link
            href="/com_login"
            className="block w-full py-3.5 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-black uppercase text-xs rounded-xl transition-all text-center tracking-wide"
          >
            Go to Community Portal
          </Link>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Unauthorised access attempts are logged and monitored
          </p>
        </div>
      </div>

      {/* Back to landing */}
      <Link
        href="/"
        className="mt-6 text-blue-300/60 hover:text-blue-200 text-xs font-medium transition-colors"
      >
        ← Back to landing page
      </Link>
    </main>
  );
}