"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* 1. THE BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/crisis-bg.jpeg" 
          alt="World Map Background" 
          className="w-full h-full object-cover"
        />
        {/* This dark blue tint makes the white text readable */}
        <div className="absolute inset-0 bg-[#001c3d]/90"></div>
      </div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        
        {/* LOGO AREA */}
        <div className="mb-8">
           {/* Replace with your actual logo img if you have one */}
           <div className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center p-2">
             <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#001c3d] font-bold">
               LOGO
             </div>
           </div>
        </div>

        {/* TEXT SECTION */}
        <h1 className="text-white text-3xl font-bold tracking-tight uppercase">
          Crisis Impact <br />
          <span className="text-blue-400">Reporter</span>
        </h1>
        <p className="text-gray-300 mt-4 text-lg">
          Real-time reports. <br />
          <span className="text-orange-400 font-semibold">Faster humanitarian action.</span>
        </p>

        {/* 3. ACTION BUTTONS */}
        <div className="w-full mt-12 space-y-4">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
             <span>📝</span> REPORT AN INCIDENT
          </button>

          <button className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all">
             <span>🗺️</span> VIEW CRISIS MAP
          </button>
        </div>

        {/* 4. THE LOGIN BUTTON (The entry point you wanted) */}
        <div className="mt-10">
          <Link href="/login">
            <button className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4">
              Staff Login / Pro Access
            </button>
          </Link>
        </div>
         {/* 4. THE LOGIN BUTTON (The entry point you wanted) */}
        <div className="mt-10">
          <Link href="/com_login">
            <button className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4">
              Community Member Login
            </button>
          </Link>
        </div>

        {/* FOOTER LOGO */}
        <div className="mt-16 opacity-80">
           <p className="text-white text-xs mb-2">Connecting communities to rapid response.</p>
           <div className="flex items-center justify-center gap-2">
              <div className="bg-blue-600 text-[10px] p-1 font-bold text-white leading-none">UN<br/>DP</div>
           </div>
        </div>

      </div>
    </main>
  );
}