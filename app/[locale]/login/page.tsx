"use client";
import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header - Using a deeper, more grounded blue */}
        <div className="bg-blue-900 pt-12 pb-10 flex flex-col items-center text-center px-6">
          <div className="mb-3">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tight">Crisis Reporting Tool</h1>
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">UNDP Partner Portal</p>
        </div>

        {/* Form Body - Deep orange accent and high-contrast inputs */}
        <div className="px-10 pt-8 pb-12 border-t-8 border-orange-600">
          <form className="space-y-5">
            <div>
              <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">User Name</label>
              <input 
                type="text" 
                placeholder="Enter username" 
                // Darker text (text-slate-900) and stronger border (border-slate-400)
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none transition-all font-semibold" 
              />
            </div>

            <div>
              <label className="block text-blue-900 font-black uppercase text-[11px] mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-900 text-slate-900 placeholder:text-slate-300 outline-none transition-all" 
              />
            </div>

            {/* Sign In - Deepened orange for better accessibility */}
            <button className="w-full py-4 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-sm rounded-xl shadow-lg transition-all active:scale-[0.98]">
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="#" className="text-blue-700 font-bold text-xs hover:underline">
              Forgot Password? Click here
            </Link>
          </div>

          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t-2 border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">New User?</span>
            <div className="flex-grow border-t-2 border-slate-100"></div>
          </div>

          <button className="w-full py-3.5 bg-white border-2 border-blue-900 text-blue-900 font-black uppercase text-[11px] rounded-xl hover:bg-slate-50 transition-all">
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}