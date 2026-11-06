"use client";
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset_password`,
      });
      if (resetError && resetError.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
        return;
      }
      // Same message whether or not the email is registered, so nobody can
      // use this form to find out who has an account.
      setSent(true);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-900 p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        <div className="bg-blue-900 p-8 flex flex-col items-center text-white text-center border-b-4 border-orange-600">
          <div className="mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">Forgot password</h1>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">
            We will email you a reset link
          </p>
        </div>

        {sent ? (
          <div className="p-8 space-y-4 text-center">
            <p className="text-blue-900 font-black text-lg">Check your email</p>
            <p className="text-slate-600 text-sm">
              If an account exists for <span className="font-bold">{email}</span>, a reset link is on
              its way. It may take a few minutes. Check your spam folder too.
            </p>
            <Link href="/com_login" className="block text-blue-700 hover:underline text-xs font-bold">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-blue-900 text-xs font-black uppercase tracking-wide">
                Email address
              </label>
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all" />
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-xs font-bold text-center">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm">
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <div className="text-center">
              <Link href="/com_login" className="text-blue-700 hover:underline text-xs font-bold">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}