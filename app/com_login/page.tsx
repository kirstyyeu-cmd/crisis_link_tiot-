"use client";
import React from 'react';
import Link from 'next/link';

export default function CommunityLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-900 p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-900 p-8 flex flex-col items-center text-white text-center border-b-4 border-orange-600">
          <div className="mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" />
            </svg>
          </div>
          <h1 className="text-lg font-black uppercase tracking-wider">Crisis Reporting Tool</h1>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">Community Member Portal</p>
        </div>

        {/* Form */}
        <form className="p-8 space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-blue-900 text-xs font-black uppercase tracking-wide">Username</label>
            <input type="text" placeholder="Enter username" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 placeholder:text-slate-300 font-semibold focus:border-blue-900 transition-all" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-blue-900 text-xs font-black uppercase tracking-wide">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none text-slate-900 font-semibold focus:border-blue-900 transition-all" />
          </div>

          <Link href="/community">
            <button type="button" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide transition-all active:scale-[0.98] text-sm mt-2">
              Sign In
            </button>
          </Link>

          <div className="text-center">
            <a href="#" className="text-blue-700 hover:underline text-xs font-bold">Forgot Password? Click here</a>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-black tracking-widest">New User?</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <Link href="/create-account" className="block w-full py-3.5 bg-white border-2 border-blue-900 text-blue-900 font-black uppercase text-xs rounded-xl hover:bg-slate-50 transition-all text-center">
            Create Account
          </Link>
        </form>
      </div>
    </main>
  );
}
