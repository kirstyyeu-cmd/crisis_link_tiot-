"use client";
import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import PasswordInput from '@/components/Passwordinput';

export default function CommunityLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Already signed in (for example the user closed the app and came back)? Go straight in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile?.role === 'reporter') {
          router.replace('/community');
          return;
        }
      }
      if (!cancelled) setChecking(false);
    })();
    return () => { cancelled = true; };
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError || !data.user) {
        setError(
          signInError?.message.toLowerCase().includes('not confirmed')
            ? 'Please confirm your email first. Check your inbox.'
            : 'Invalid email or password.'
        );
        return;
      }

      // This portal is for community members only
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      if (profile?.role !== 'reporter') {
        await supabase.auth.signOut();
        setError('This portal is for community members. Please use the login for your account type.');
        return;
      }

      router.push('/community');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (checking) return <main className="min-h-screen bg-blue-900" />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-900 p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-900 p-8 flex flex-col items-center text-white text-center border-b-4 border-orange-600">
          <div className="mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">Crisis Link</h1>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">
            Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-blue-900 text-xs font-black uppercase tracking-wide">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-blue-900 text-xs font-black uppercase tracking-wide">
              Password
            </label>
            <PasswordInput
              id="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-xs font-bold text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm mt-2"
          >
            {loading ? 'Signing in...' : 'Sign in to portal'}
          </button>

          <div className="text-center">
            <Link href="/forgot_password" className="text-blue-700 hover:underline text-xs font-bold">
              Forgot password? Click here
            </Link>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              New to platform?
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          <Link
            href="/create_account"
            className="block w-full py-3.5 bg-white border-2 border-blue-900 text-blue-900 font-black uppercase text-xs rounded-xl hover:bg-slate-50 transition-all text-center"
          >
            Create account
          </Link>
        </form>
      </div>
    </main>
  );
}