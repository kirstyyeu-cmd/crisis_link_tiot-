"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import PasswordInput from '@/components/Passwordinput';

const inputClass =
  'w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all';

export default function ResetPasswordPage() {
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const verifying = useRef(false);

  // The reset link lets the user set a new password. The link carries a one-time
  // token that is checked here, so it works on any device or browser.
  useEffect(() => {
    // If the link failed, Supabase may put the reason in the address
    const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const fromQuery = new URLSearchParams(window.location.search);
    const reason = fromHash.get('error_description') || fromQuery.get('error_description');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValid(true);
        setChecked(true);
      }
    });

    const tokenHash = fromQuery.get('token_hash');
    if (tokenHash && fromQuery.get('type') === 'recovery') {
      if (!verifying.current) {
        verifying.current = true;
        supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }).then(({ error }) => {
          window.history.replaceState(null, '', window.location.pathname); // stop reuse on refresh
          if (error) setLinkError('The link has expired or was already used.');
          else setValid(true);
          setChecked(true);
        });
      }
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (reason) setLinkError(reason);
        if (session) setValid(true);
        setChecked(true);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('Could not update your password. The link may have expired. Please request a new one.');
        return;
      }
      await supabase.auth.signOut();
      setDone(true);
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
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">Set new password</h1>
        </div>

        {!checked ? (
          <p className="p-8 text-center text-slate-500 text-sm font-semibold">Checking your link...</p>
        ) : done ? (
          <div className="p-8 space-y-4 text-center">
            <p className="text-blue-900 font-black text-lg">Password updated</p>
            <p className="text-slate-600 text-sm">You can now sign in with your new password.</p>
            <Link href="/com_login"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl uppercase tracking-wide text-sm">
              Go to sign in
            </Link>
          </div>
        ) : !valid ? (
          <div className="p-8 space-y-4 text-center">
            <p className="text-slate-600 text-sm">This reset link is invalid or has expired.</p>
            {linkError && (
              <p className="text-slate-400 text-xs font-semibold">Reason: {linkError}</p>
            )}
            <p className="text-slate-500 text-xs">
              Open the link in the same browser you requested it from, and use it only once.
            </p>
            <Link href="/forgot_password" className="block text-blue-700 hover:underline text-xs font-bold">
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-blue-900 text-xs font-black uppercase tracking-wide">
                New password
              </label>
              <PasswordInput id="password" required autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className="text-blue-900 text-xs font-black uppercase tracking-wide">
                Confirm new password
              </label>
              <PasswordInput id="confirm" required autoComplete="new-password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-xs font-bold text-center">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm">
              {loading ? 'Saving...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}