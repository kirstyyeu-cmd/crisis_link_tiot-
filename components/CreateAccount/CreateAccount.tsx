"use client";

import { useState } from "react";
import Image from "next/image";
import { validateForm, FormErrors } from "./formValidation";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
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
    setSuccessMessage("");

    // Validate all fields
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    // Mark all fields as touched to show errors
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Simulate API call
    setIsSubmitting(true);
    try {
      // Replace this with your actual API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Account created successfully!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTouched({});
        // You can redirect or perform other actions here
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "An account with this email already exists",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: "An error occurred. Please try again.",
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
              <div className="text-8xl">👥</div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-center">Join Our Community</h2>
            <p className="text-lg text-blue-100 text-center">
              Be part of something bigger. Create an account and start making an impact today.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 w-full bg-white rounded-2xl shadow-2xl p-8">
            {/* Header with Logos */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-20 w-20 bg-blue-50 rounded-lg flex items-center justify-center p-2">
                  <Image
                    src="/picture-4.png"
                    alt="Logo 1"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="h-20 w-20 bg-blue-50 rounded-lg flex items-center justify-center p-2">
                  <Image
                    src="/picture-2.png"
                    alt="Logo 2"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">Welcome to our platform</p>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-orange-500 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 mb-8">Join us today and get started</p>

          {successMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                <span>✓</span>{successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-blue-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                  touched.fullName && errors.fullName
                    ? "border-red-500 bg-red-50"
                    : "border-blue-200 bg-blue-50 focus:border-orange-500"
                }`}
                placeholder="John Doe"
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.fullName}
                </p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-2">
                Password
              </label>
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
              {formData.password && <PasswordStrengthIndicator password={formData.password} />}
              {touched.password && errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-blue-200 bg-blue-50 focus:border-orange-500"
                }`}
                placeholder="••••••••"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.confirmPassword}
                </p>
              )}
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
                  Creating Account...
                </>
              ) : (
                "✓ Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-900 hover:text-blue-700 font-bold">
              Sign in
            </a>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
