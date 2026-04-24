"use client";
import React from 'react';
import Link from 'next/link';

export default function CrisisLogin() {
  return (
    // Background matches the dark theme of the landing page
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
      
      {/* Container: white background for the form area */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* HEADER: Navy Blue background with Orange bottom border */}
        <div className="bg-slate-900 p-8 flex flex-col items-center text-white text-center border-b-4 border-orange-500">
          
          <div className="mb-4 relative flex items-center justify-center">
            {/* The Outer Pin Shape */}
            <div className="w-12 h-12 bg-white rounded-t-full rounded-bl-full rotate-45 flex items-center justify-center shadow-lg">
              {/* The Inner "Hole" */}
              <div className="w-5 h-5 bg-slate-900 rounded-full -rotate-45"></div>
            </div>
          </div>
          
          <h1 className="text-lg font-bold uppercase tracking-wider">Crisis Reporting Tool</h1>
          <p className="text-blue-300 text-sm font-medium">UNDP PARTNER PORTAL</p>
        </div>

        {/* FORM SECTION */}
        <form className="p-8 space-y-5">
          
          {/* USER NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-black uppercase tracking-tight">User Name</label>
            <input 
              type="text" 
              placeholder="Enter username"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-900 placeholder:text-slate-900 font-medium focus:border-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-black uppercase tracking-tight">Password</label>
            <input 
              type="text" 
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-900 placeholder:text-slate-900 font-medium focus:border-blue-500"
            />
          </div>

          {/* SIGN IN BUTTON: Bright Orange to match 'Report Incident' */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md uppercase transition-all active:scale-95">
            Sign In
          </button>

          <div className="text-center">
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
              Forgot Password? Click here
            </a>
          </div>

          {/* FAINT BLUE DIVIDER */}
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-blue-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">NEW USER?</span>
            <div className="flex-grow border-t border-blue-100"></div>
          </div>

          {/* SIGN UP BUTTON: Transparent with Navy border */}
          <button className="w-full border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold py-3 rounded-lg uppercase transition-colors">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}