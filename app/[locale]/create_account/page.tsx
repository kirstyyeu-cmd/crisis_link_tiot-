"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, CheckCircle, UserPlus } from 'lucide-react';

export default function CreateAccountPage() {
  const t = useTranslations();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "", role: "community" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState("");

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirm) {
      setError(t('createAccount.errorOccurred')); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    // TODO: replace with real API call
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-center">
          <div className="bg-blue-900 pt-10 pb-8 px-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white font-black text-xl uppercase tracking-tight">
              {t('createAccount.title')}
            </h2>
            <p className="text-blue-200 text-sm mt-2">{t('createAccount.welcomePlatform')}</p>
          </div>
          <div className="p-8 space-y-4">
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              {t('createAccount.successMessage')}
            </p>
            <Link href="/com_login" className="block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-sm rounded-xl transition-all active:scale-[0.98]">
              {t('createAccount.signIn')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="bg-blue-900 pt-10 pb-8 flex flex-col items-center text-center px-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-xl font-black uppercase tracking-tight">
            {t('createAccount.title')}
          </h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">
            Crisis Impact Reporter
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pt-7 pb-10 border-t-8 border-orange-600 space-y-4">

          {/* Role selector */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              {t('createAccount.welcomeTitle')}
            </label>
            <div className="flex gap-2">
              {["community", "responder"].map(r => (
                <button key={r} type="button" onClick={() => update("role", r)}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all ${
                    form.role === r
                      ? "bg-blue-900 text-white border-2 border-blue-900"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300"
                  }`}>
                  {r === "community" ? t('createAccount.welcomeTitle') : "Field Responder"}
                </button>
              ))}
            </div>
          </div>

          {/* Full name */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              {t('createAccount.fullNameLabel')} <span className="text-orange-600">*</span>
            </label>
            <input type="text" value={form.fullName} onChange={e => update("fullName", e.target.value)}
              placeholder={t('createAccount.fullNamePlaceholder')}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              {t('createAccount.emailLabel')} <span className="text-orange-600">*</span>
            </label>
            <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
              placeholder={t('createAccount.emailPlaceholder')}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              Phone Number <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
              placeholder="+263 7X XXX XXXX"
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              {t('createAccount.passwordLabel')} <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={form.password}
                onChange={e => update("password", e.target.value)}
                placeholder={t('createAccount.passwordPlaceholder')}
                className="w-full p-3 pr-12 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">
              {t('createAccount.confirmPasswordLabel')} <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={form.confirm}
                onChange={e => update("confirm", e.target.value)}
                placeholder={t('createAccount.confirmPasswordPlaceholder')}
                className="w-full p-3 pr-12 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none font-semibold transition-all"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs font-bold text-center">{error}</p>}

          <button type="submit" className="w-full py-4 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t('createAccount.submitBtn')}
          </button>

          <div className="text-center pt-2">
            <span className="text-slate-400 text-xs font-medium">{t('createAccount.alreadyHave')} </span>
            <Link href="/com_login" className="text-blue-700 font-black text-xs hover:underline uppercase">
              {t('createAccount.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}