"use client";
import { useState } from "react";
import { validateSignInForm, SignInErrors } from "./signInValidation";
import { AlertTriangle, LogIn, Loader, Lock, Link } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SignIn() {
  const t = useTranslations();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState<SignInErrors>({});
  const [touched, setTouched]   = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof SignInErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors = validateSignInForm(formData);
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rememberMe }),
      });
      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        setErrors(prev => ({ ...prev, general: t('signIn.errorGeneral') }));
      }
    } catch {
      setErrors(prev => ({ ...prev, general: t('signIn.errorOccurred') }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row gap-8 items-center">

          {/* Left Side */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center text-white">
            <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <Lock className="w-20 h-20 text-white/80" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-center">
              {t('signIn.welcomeTitle')}
            </h2>
            <p className="text-lg text-blue-100 text-center">
              {t('signIn.welcomeDesc')}
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 w-full bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-orange-500 bg-clip-text text-transparent mb-2">
              {t('signIn.title')}
            </h1>
            <p className="text-gray-600 mb-8">{t('signIn.subtitle')}</p>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                  {t('signIn.emailLabel')}
                </label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={t('signIn.emailPlaceholder')}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    touched.email && errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-blue-200 bg-blue-50 focus:border-orange-500"
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-blue-900">
                    {t('signIn.passwordLabel')}
                  </label>
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                    {t('signIn.forgotPassword')}
                  </Link>
                </div>
                <input
                  type="password" id="password" name="password"
                  value={formData.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={t('signIn.passwordPlaceholder')}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    touched.password && errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-blue-200 bg-blue-50 focus:border-orange-500"
                  }`}
                />
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="rememberMe"
                  checked={rememberMe} onChange={handleChange}
                  className="w-4 h-4 rounded border-blue-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700 font-medium cursor-pointer">
                  {t('signIn.rememberMe')}
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isSubmitting}
                className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <><Loader className="w-4 h-4 animate-spin" />{t('signIn.submitting')}</>
                ) : (
                  <><LogIn className="w-4 h-4" />{t('signIn.submitBtn')}</>
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              {t('signIn.noAccount')}{" "}
              <Link href="/" className="text-blue-900 hover:text-blue-700 font-bold">
                {t('signIn.createOne')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}