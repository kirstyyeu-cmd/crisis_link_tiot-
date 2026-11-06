"use client";
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import PasswordInput from '@/components/Passwordinput';

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-slate-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-600'];
  return { score, label: labels[score], color: colors[score] };
}

const inputClass =
  'w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all';
const labelClass = 'text-blue-900 text-xs font-black uppercase tracking-wide';

export default function CreateAccountPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim(), phone: phone.trim(), address: address.trim() },
          emailRedirectTo: `${window.location.origin}/com_login`,
        },
      });

      if (signUpError) {
        setError(
          signUpError.message.toLowerCase().includes('already')
            ? 'This email is already registered.'
            : 'An error occurred. Please try again.'
        );
        return;
      }
      // Supabase returns an empty identities list when the email already exists
      if (data.user && data.user.identities?.length === 0) {
        setError('This email is already registered.');
        return;
      }
      if (data.session) {
        router.push('/community'); // email confirmation is off
        return;
      }
      setDone(true); // email confirmation is on
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
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">Create account</h1>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">
            Sign up to report and track crises
          </p>
        </div>

        {done ? (
          <div className="p-8 space-y-4 text-center">
            <p className="text-blue-900 font-black text-lg">Account created!</p>
            <p className="text-slate-600 text-sm">
              We sent a confirmation link to <span className="font-bold">{email}</span>. Open it,
              then sign in.
            </p>
            <Link
              href="/com_login"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl uppercase tracking-wide text-sm"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className={labelClass}>Full name</label>
              <input id="fullName" required autoComplete="name" value={fullName}
                onChange={(e) => setFullName(e.target.value)} placeholder="FirstName LastName" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelClass}>Phone number</label>
              <input id="phone" type="tel" required autoComplete="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} placeholder="+263 77 123 4567" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>Email address</label>
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address" className={labelClass}>Address</label>
              <input id="address" required autoComplete="street-address" value={address}
                onChange={(e) => setAddress(e.target.value)} placeholder="Street, suburb, town" className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className={labelClass}>Password</label>
              <PasswordInput id="password" required autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              {password && (
                <div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(strength.score / 4) * 100}%` }} />
                  </div>
                  <p className="text-slate-500 text-[11px] font-semibold mt-1">
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className={labelClass}>Confirm password</label>
              <PasswordInput id="confirm" required autoComplete="new-password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-xs font-bold text-center">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm mt-2">
              {loading ? 'Creating account...' : 'Register account'}
            </button>

            <p className="text-center text-xs text-slate-500 font-semibold">
              Already have an account?{' '}
              <Link href="/com_login" className="text-blue-700 hover:underline font-bold">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}