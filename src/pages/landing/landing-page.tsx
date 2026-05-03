import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Beef,
  Bot,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  LayoutDashboard,
  Leaf,
  LogIn,
  Mountain,
  ShieldAlert,
  Sparkles,
  Sprout,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { PublicNav } from '@/components/landing/public-nav';
import { Button } from '@/components/ui/button';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

// Royalty-free Unsplash photography (loaded directly, no API key required).
const SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Smart farming, simplified',
    title: 'Grow more.\nWorry less.',
    subtitle:
      'Fieldly turns every parcel, animal, and weather signal into a single living dashboard — powered by AI, designed for real farmers.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'AI agronomist on call',
    title: 'Diagnose plants\nin one snap.',
    subtitle:
      'Snap a leaf, get an instant diagnosis, treatment plan and prevention checklist — built on your farm’s own history.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Soil that speaks',
    title: 'Read your soil\nlike a story.',
    subtitle:
      'pH, nutrients, moisture and predicted soil type — visualised parcel by parcel so every decision starts from the ground up.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Livestock, in real time',
    title: 'Every animal,\naccounted for.',
    subtitle:
      'Vitals, vaccinations, lineage and fattening targets — all flowing into one calm view of your herd.',
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: 'AI agronomist',
    text: 'Crop recommendations tuned to your soil, climate and history.',
    gradient: 'from-primary/15 to-accent/15',
  },
  {
    icon: Stethoscope,
    title: 'Plant doctor',
    text: 'Snap a leaf, get a diagnosis, treatment plan and prevention plan.',
    gradient: 'from-accent/15 to-info/15',
  },
  {
    icon: Mountain,
    title: 'Soil intelligence',
    text: 'pH, NPK, moisture and predicted soil type — per parcel, over time.',
    gradient: 'from-warning/15 to-primary/15',
  },
  {
    icon: CloudSun,
    title: 'Hyper-local weather',
    text: '7-day forecasts and irrigation hints anchored to each field.',
    gradient: 'from-info/15 to-secondary/15',
  },
  {
    icon: ShieldAlert,
    title: 'Farm security',
    text: 'Real-time intrusion alerts with siren control from your pocket.',
    gradient: 'from-danger/10 to-warning/15',
  },
  {
    icon: Beef,
    title: 'Livestock OS',
    text: 'Vitals, lineage, vaccinations, fattening — all in one calm feed.',
    gradient: 'from-secondary/15 to-primary/15',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Map your land',
    text: 'Add your parcels, soil types and irrigation in minutes.',
  },
  {
    n: '02',
    title: 'Connect the signals',
    text: 'Weather, soil samples, animal sensors and security cameras converge.',
  },
  {
    n: '03',
    title: 'Let AI advise',
    text: 'Daily insights and one-tap actions — no agronomy degree required.',
  },
];

const STATS = [
  { value: '+38%', label: 'average yield lift' },
  { value: '−42%', label: 'water waste' },
  { value: '12k+', label: 'parcels monitored' },
  { value: '24/7', label: 'AI on call' },
];

const TESTIMONIALS = [
  {
    name: 'Khaled B.',
    role: 'Olive farmer · Sfax',
    quote:
      'I used to lose nights worrying about my olive trees. Now Fieldly tells me what to do before sunrise.',
  },
  {
    name: 'Amira T.',
    role: 'Dairy operator · Mahdia',
    quote:
      'Tracking 80 cows used to mean a notebook and a prayer. Today everything is one tap away.',
  },
  {
    name: 'Youssef M.',
    role: 'Vegetable grower · Cap Bon',
    quote:
      'The plant doctor caught a mildew outbreak two days before I would have. Saved an entire greenhouse.',
  },
];

export function LandingPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const current = SLIDES[slide];

  return (
    <div className="min-h-screen bg-bg text-ink">
      <PublicNav />

      {/* ─── HERO SLIDESHOW ─────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              i === slide ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden={i !== slide}
          >
            <img
              src={s.image}
              alt=""
              className={cn(
                'size-full object-cover',
                i === slide && 'animate-slide-zoom',
              )}
            />
          </div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/55 to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,148,72,0.35),transparent_60%)]" />

        {/* Floating blobs */}
        <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute right-0 top-1/4 size-96 rounded-full bg-accent/25 blur-3xl animate-blob [animation-delay:-4s]" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container">
            <div key={slide} className="max-w-3xl space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="size-3.5" /> {current.eyebrow}
              </span>
              <h1 className="whitespace-pre-line font-display text-5xl font-bold leading-[1.05] text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
                {current.title}
              </h1>
              <p className="max-w-xl text-lg text-white/85 sm:text-xl">{current.subtitle}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isAuthenticated ? (
                  <Button asChild size="lg" variant="gradient" className="shadow-card">
                    <Link to="/app/dashboard">
                      <LayoutDashboard className="size-5" /> Open my dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" variant="gradient" className="shadow-card">
                      <Link to="/auth/sign-up">
                        Start free <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                    >
                      <Link to="/auth/sign-in">
                        <LogIn className="size-4" /> I already have an account
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <button
          type="button"
          onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition-all hover:scale-110 hover:bg-white/20 sm:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition-all hover:scale-110 hover:bg-white/20 sm:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i === slide ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      </section>

      {/* ─── STATS RIBBON ───────────────────────────────────────── */}
      <section className="relative -mt-12 z-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border/60 bg-surface/95 p-6 shadow-card backdrop-blur-xl sm:grid-cols-4 sm:gap-6 sm:p-8">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="bg-gradient-brand bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="container py-24 sm:py-32">
        <SectionHeading
          eyebrow="Everything in one place"
          title="A whole farm, in your pocket."
          description="Modules built for real fields, real animals and real weather — not enterprise checkboxes."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={cn(
                  'absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                  f.gradient,
                )}
              />
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MODULES STRIP ──────────────────────────────────────── */}
      <section id="modules" className="border-y border-border/60 bg-gradient-to-br from-primary/5 via-bg to-accent/5 py-24">
        <div className="container">
          <SectionHeading
            eyebrow="Modules"
            title="Six pillars. One Fieldly."
            description="Each module is great on its own. Together they compound."
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Sprout, label: 'Parcels' },
              { icon: Beef, label: 'Livestock' },
              { icon: CloudSun, label: 'Weather' },
              { icon: Stethoscope, label: 'Plant Doctor' },
              { icon: Mountain, label: 'Soil' },
              { icon: ShieldAlert, label: 'Security' },
            ].map((m, i) => (
              <div
                key={m.label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-surface p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-gradient-brand group-hover:text-white animate-float-slow" style={{ animationDelay: `${i * 200}ms` }}>
                  <m.icon className="size-6" />
                </div>
                <p className="text-sm font-semibold text-ink">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how" className="container py-24 sm:py-32">
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in three steps."
          description="No installs, no consultants. Just sign up and start sowing."
        />
        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-border/60 bg-surface p-7 shadow-soft animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand font-display text-lg font-bold text-white shadow-card">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section
        id="testimonials"
        className="border-y border-border/60 bg-gradient-to-br from-accent/5 via-bg to-primary/5 py-24"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Stories from the field"
            title="Loved by farmers, not algorithms."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="rounded-3xl border border-border/60 bg-surface p-7 shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Leaf className="size-6 text-primary" />
                <p className="mt-4 text-base leading-relaxed text-ink">“{t.quote}”</p>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="container py-24 sm:py-32">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand p-10 text-center shadow-card sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl animate-blob" />
          <div className="relative space-y-6">
            <Zap className="mx-auto size-10 text-white" />
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Your farm’s next chapter starts today.
            </h2>
            <p className="mx-auto max-w-xl text-white/85">
              Join the farmers turning soil, sky and silicon into one productive system.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/app/dashboard">
                    <LayoutDashboard className="size-5" /> Open dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link to="/auth/sign-up">
                      Create your account <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/auth/sign-in">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-surface/60">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <Sprout className="size-4" />
            </span>
            <span className="font-display font-bold text-ink">Fieldly</span>
            <span>· {new Date().getFullYear()}</span>
          </div>
          <p>Built with care for the people who feed us.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default LandingPage;
