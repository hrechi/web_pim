import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/common/logo';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh bg-bg">
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-brand lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(175,254,0,0.35),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(26,188,156,0.4),transparent_55%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Logo withText className="text-white [&_p]:text-white" />
          <div className="max-w-lg space-y-6">
            <h1 className="text-display font-bold leading-tight">
              Manage your entire farm from one professional dashboard.
            </h1>
            <p className="text-lg text-white/85">
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
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                >
                  <p className="text-xs uppercase tracking-wide text-white/70">{s.k}</p>
                  <p className="mt-1 text-lg font-semibold">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/70">© {new Date().getFullYear()} Fieldly Smart Farming</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
