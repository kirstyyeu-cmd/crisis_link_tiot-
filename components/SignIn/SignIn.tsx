"use client";

import { useState } from "react";
import { validateSignInForm, SignInErrors } from "./signInValidation";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<SignInErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (errors[name as keyof SignInErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validate all fields
    const newErrors = validateSignInForm(formData);
    setErrors(newErrors);

    // Mark all fields as touched to show errors
    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Simulate API call
    setIsSubmitting(true);
    try {
      // Replace this with your actual API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rememberMe,
        }),
      });

      if (response.ok) {
        // Handle successful login - redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid email or password",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "An error occurred. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Side - Illustration Area */}
          <div className="lg:w-1/2 flex flex-col items-center justify-center text-white">
            <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <div className="text-8xl">🔐</div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-center">Welcome Back</h2>
            <p className="text-lg text-blue-100 text-center">
              Sign in to your account and continue making an impact in your community.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 w-full bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-orange-500 bg-clip-text text-transparent mb-2">
              Sign In
            </h1>
            <p className="text-gray-600 mb-8">Access your account to continue</p>

            {errors.general && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-50 border border-red-300 rounded-lg">
                <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span>{errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    touched.email && errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-blue-200 bg-blue-50 focus:border-orange-500"
                  }`}
                  placeholder="you@example.com"
                />
                {touched.email && errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-blue-900">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    touched.password && errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-blue-200 bg-blue-50 focus:border-orange-500"
                  }`}
                  placeholder="••••••••"
                />
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-blue-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account?{" "}
              <a href="/" className="text-blue-900 hover:text-blue-700 font-bold">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
