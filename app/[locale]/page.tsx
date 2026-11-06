import Link from 'next/link';
import { PlusCircle, Map } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="/crisis-bg.jpeg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-900/90" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center text-center">

        {/* Title */}
        <h1 className="text-white text-3xl font-black tracking-tight uppercase">
          Crisis <br />
          <span className="text-orange-400">Link</span>
        </h1>
        <p className="text-slate-300 mt-3 text-base">
          Real-time reports <br />
          <span className="text-orange-400 font-semibold">Faster humanitarian action</span>
        </p>

        {/* CTA Buttons */}
        <div className="w-full mt-8 space-y-3">
          <Link href="/report" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-wide">
            <PlusCircle className="w-5 h-5" />
            Report a crisis
          </Link>
          <Link href="/crisis-map" className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide">
            <Map className="w-5 h-5" />
            View crisis map
          </Link>
        </div>

        {/* Login links */}
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/com_login" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            Community Access
          </Link>
          <Link href="/org-register" className="text-blue-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors">
            Response Organisations
          </Link>
        </div>

        {/* Footer */}
        <p className="text-slate-400 text-xl mt-10">Connecting communities to rapid response; Report It; Route It; Resolve It</p>
        
      </div>
    </main>
  );
}