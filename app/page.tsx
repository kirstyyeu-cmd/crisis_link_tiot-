export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-4xl bg-white p-10 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
        <h1 className="text-4xl font-extrabold text-slate-900">Welcome to Crisis Link</h1>
        <p className="mt-4 text-base text-slate-600">Use the link below to open the UNDP create account page.</p>
        <a
          href="/create_account"
          className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Go to Create Account
        </a>
      </div>
    </main>
  );
}
