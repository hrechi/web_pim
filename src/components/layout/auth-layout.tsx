import { Outlet, Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh bg-bg">

      {/* ── LEFT — Brand panel (desktop only) ───────────────── */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        {/* Farm background image */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark green overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c2e]/90 via-[#309448]/80 to-[#1abc9c]/70" />
        {/* Radial highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(175,254,0,0.20),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(26,188,156,0.30),transparent_50%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link to="/" className="group flex w-fit items-center gap-3">
            <img
              src="/image/logo.png"
              alt="Fieldly"
              className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="max-w-lg space-y-6">
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight">
              Manage your entire farm from one professional dashboard.
            </h1>
            <p className="text-lg text-white/85 leading-relaxed">
              Parcels, livestock, weather, soil insights, plant diagnostics, and real-time security
              — everything Fieldly offers, now on the web.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { k: 'Parcels', v: 'GIS-ready' },
                { k: 'Livestock', v: 'Tracked' },
                { k: 'AI', v: 'Built-in' },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/15"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">{s.k}</p>
                  <p className="mt-1 text-xl font-bold">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">© {new Date().getFullYear()} Fieldly Smart Farming</p>
        </div>
      </div>

      {/* ── RIGHT — Form panel ─────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link to="/" className="group flex w-fit items-center gap-3">
              <img
                src="/image/logo.png"
                alt="Fieldly"
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
