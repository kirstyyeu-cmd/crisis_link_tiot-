export default function CreateAccountPage() {
  return (
    <main className="min-h-screen bg-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-4xl bg-white/95 p-8 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">UNDP</span>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-900">Create your account</h1>
            <p className="mt-3 text-base text-slate-600">Join the UNDP community with a secure account. No images, just clean access.</p>
          </div>

          <form className="mt-10 grid gap-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Organization</span>
              <input
                type="text"
                name="organization"
                placeholder="Your organization"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Country</span>
              <input
                type="text"
                name="country"
                placeholder="Country or region"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex w-full justify-center rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
