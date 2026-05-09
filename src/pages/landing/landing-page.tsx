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
  Mail,
  MapPin,
  Mountain,
  Phone,
  Send,
  ShieldAlert,
  Sparkles,
  Sprout,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { PublicNav } from '@/components/landing/public-nav';
import { Footer } from '@/components/landing/footer';
import { AuroraBackground } from '@/components/landing/aurora-background';
import { EspritMap } from '@/components/landing/esprit-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  {
    image:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Precision irrigation',
    title: 'Water smarter,\nnot harder.',
    subtitle:
      'Real-time moisture mapping ensures every drop counts. Cut waste, boost yields.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Crop insights',
    title: 'Growth tracking\nfrom seed to sale.',
    subtitle:
      'Monitor crop development daily. Predict harvest quality weeks ahead.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=2000&q=80',
    eyebrow: 'Resource management',
    title: 'Control everything\nat your fingertips.',
    subtitle:
      'Drip irrigation, sensors, cameras — all synchronized in one interface.',
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

const TEAM_MEMBERS = [
  { id: 1, name: 'Louay Hrechi', image: '/image/team-member-1.jpg', role: 'Mobile Engineer' },
  { id: 2, name: 'Aya Flah', image: '/image/team-member-2.png', role: 'Mobile Engineer' },
  { id: 3, name: 'Amel Mediouni', image: '/image/team-member-3.jpg', role: 'Mobile Engineer' },
  { id: 4, name: 'Yessine Nahdi', image: '/image/team-member-4.jpg', role: 'Mobile Engineer' },
  { id: 5, name: 'Yosser Rafrafi', image: '/image/team-member-5.jpg', role: 'Mobile Engineer' },
];

export function LandingPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [slide, setSlide] = useState(0);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setContactLoading(true);
    try {
      const contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      contacts.push({
        id: Date.now(),
        email: contactEmail,
        message: contactMessage,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('contactMessages', JSON.stringify(contacts));
      toast.success('Message sent! We\'ll get back to you soon.');
      setContactEmail('');
      setContactMessage('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setContactLoading(false);
    }
  };

  const current = SLIDES[slide];

  return (
    <AuroraBackground>
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
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur animate-fade-down">
                <Sparkles className="size-3.5 animate-scale-pulse" /> {current.eyebrow}
              </span>
              <h1 className="whitespace-pre-line font-display text-3xl font-bold leading-[1.05] text-white drop-shadow-sm sm:text-5xl lg:text-7xl animate-slide-up">
                {current.title}
              </h1>
              <p className="max-w-xl text-base text-white/85 sm:text-xl animate-fade-up" style={{ animationDelay: '100ms' }}>{current.subtitle}</p>
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
                {isAuthenticated ? (
                  <Button asChild size="lg" variant="gradient" className="shadow-card hover:shadow-card/2 hover:scale-105 transition-all animate-bounce-slight">
                    <Link to="/app/dashboard">
                      <LayoutDashboard className="size-5" /> Open my dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" variant="gradient" className="shadow-card hover:shadow-card/2 hover:scale-105 transition-all animate-bounce-slight">
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
      <section className="relative -mt-16 z-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-px rounded-3xl border border-white/60 bg-white/20 shadow-card backdrop-blur-2xl overflow-hidden sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="group flex flex-col items-center justify-center gap-1 px-6 py-8 text-center transition-all hover:bg-primary/5 cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="bg-gradient-brand bg-clip-text font-display text-3xl sm:text-4xl font-black text-transparent tracking-tight">
                  {s.value}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="container py-20 sm:py-28">
        <SectionHeading
          eyebrow="Everything in one place"
          title="A whole farm, in your pocket."
          description="Modules built for real fields, real animals and real weather — not enterprise checkboxes."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white/60 backdrop-blur-md p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(48,148,72,0.15)] hover:border-primary/30 cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Glowing orb */}
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-150" />

              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(48,148,72,0.4)]">
                <f.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                Learn more <ArrowRight className="size-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MODULES STRIP ──────────────────────────────────────── */}
      <section id="modules" className="relative overflow-hidden py-20">
        {/* Full-width gradient band */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Modules"
            title="Six pillars. One Fieldly."
            description="Each module is great on its own. Together they compound."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Sprout, label: 'Parcels', color: 'from-primary to-primary/70' },
              { icon: Beef, label: 'Livestock', color: 'from-accent to-accent/70' },
              { icon: CloudSun, label: 'Weather', color: 'from-info to-info/70' },
              { icon: Stethoscope, label: 'Plant Doctor', color: 'from-secondary to-secondary/70' },
              { icon: Mountain, label: 'Soil', color: 'from-warning to-warning/70' },
              { icon: ShieldAlert, label: 'Security', color: 'from-danger to-danger/70' },
            ].map((m, i) => (
              <div
                key={m.label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(48,148,72,0.15)] cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <m.icon className="size-6" />
                </div>
                <p className="text-sm font-bold text-ink">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how" className="container py-20 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Up and running in three steps."
          description="No installs, no consultants. Just sign up and start sowing."
        />
        <div className="relative mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Animated connector */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px md:block">
            <div className="h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="group relative rounded-3xl border border-primary/10 bg-white/60 backdrop-blur-md p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(48,148,72,0.12)] hover:border-primary/25 cursor-pointer"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-brand font-display text-xl font-black text-white shadow-[0_8px_24px_rgba(48,148,72,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_32px_rgba(48,148,72,0.5)]">
                {s.n}
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section id="testimonials" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-accent/4" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Stories from the field"
            title="Loved by farmers, not algorithms."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-7 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(48,148,72,0.12)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Quote mark decoration */}
                <div className="absolute -right-2 -top-2 font-display text-8xl font-black text-primary/8 leading-none select-none">"</div>
                <div className="relative">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-warning text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-ink/80 italic">"{t.quote}"</p>
                  <div className="mt-5 flex items-center gap-3 pt-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-gradient-brand text-white text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-ink">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JETRACER ROBOT ──────────────────────────────────────── */}
      <section id="jetracer" className="container py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
          {/* 3D Robot embed */}
          <div className="group relative rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(48,148,72,0.2)] transition-all duration-500 hover:shadow-[0_32px_100px_rgba(48,148,72,0.3)]">
            <div className="w-full h-80 md:h-[480px]">
              <iframe
                title="JetRacer AI Robot Car Kit for Nvidia Jetson"
                className="w-full h-full rounded-3xl border-0"
                src="https://sketchfab.com/models/a6e25e470de1425281f17aba1a721f7d/embed?autostart=1&ui_hint=0&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&preload=1&transparent=0&autospin=0.3"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-white">Live field patrol active</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Bot className="size-3.5" /> Innovation
              </span>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-black leading-tight text-ink">
                JetRacer: Autonomous<br />Field Intelligence
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { icon: Bot, title: 'Real-time Field Monitoring', text: 'Autonomous ground robot that patrols your fields 24/7, capturing high-resolution imagery and sensor data.' },
                { icon: Zap, title: 'AI-Powered Analysis', text: 'Computer vision identifies crop stress, disease, pest damage, and irrigation issues instantly.' },
                { icon: Leaf, title: 'Autonomous Deployment', text: 'Self-charging with optimal patrol routes. Integrates with Fieldly based on crop stage and weather.' },
                { icon: Sprout, title: 'Predictive Insights', text: 'Combines historical data with real-time observations to forecast yield impact and recommend actions.' },
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-primary/10 hover:bg-primary/4">
                  <div className="flex-shrink-0 flex size-10 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft transition-transform group-hover:scale-110">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="bg-gradient-brand text-white hover:opacity-90 shadow-[0_8px_24px_rgba(48,148,72,0.35)] hover:shadow-[0_12px_32px_rgba(48,148,72,0.5)] transition-all">
              <a href="https://www.waveshare.com/wiki/JetRacer_AI_Kit" target="_blank" rel="noopener noreferrer">
                Learn More About JetRacer <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="container py-16 sm:py-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing."
          description="Start free, scale when you're ready. No hidden fees, no surprises."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {/* FREE */}
          <div className="relative flex flex-col rounded-3xl border border-border/60 bg-white/70 backdrop-blur-sm p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
            <div className="mb-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sprout className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">Free</h3>
              <p className="text-sm text-muted-foreground">Discover without risk</p>
            </div>
            <div className="mb-5">
              <span className="font-display text-4xl font-bold text-ink">0 DT</span>
              <span className="text-sm text-muted-foreground"> / month</span>
            </div>
            <div className="mb-5 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning flex items-center gap-2">
              <Zap className="size-3.5" /> Permanent (limited)
            </div>
            <ul className="mb-8 flex-1 space-y-2.5 text-sm">
              <PricingFeature text="Up to 5 animals" />
              <PricingFeature text="1 field / parcel" />
              <PricingFeature text="Basic dashboard" />
              <PricingFeature text="AI chat (10 msg/day)" />
              <PricingFeature text="No IoT diagnostics" disabled />
              <PricingFeature text="No health alerts" disabled />
              <PricingFeature text="No reports" disabled />
              <PricingFeature text="No sale catalogues" disabled />
            </ul>
            <p className="mb-4 text-xs text-danger font-medium flex items-center gap-1.5">
              <ShieldAlert className="size-3.5" /> Limited to spark the upgrade
            </p>
            <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
              <Link to="/auth/sign-up">Start for free</Link>
            </Button>
          </div>

          {/* STARTER */}
          <div className="relative flex flex-col rounded-3xl border border-border/60 bg-white/70 backdrop-blur-sm p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
            <div className="mb-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Leaf className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">Starter</h3>
              <p className="text-sm text-muted-foreground">Small farmer / breeder</p>
            </div>
            <div className="mb-1">
              <span className="font-display text-4xl font-bold text-primary">29 DT</span>
              <span className="text-sm text-muted-foreground"> / month</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">≈ €9 · or 290 DT/year (−17%)</p>
            <div className="mb-5 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning flex items-center gap-2">
              <Sparkles className="size-3.5" /> 14-day free trial included
            </div>
            <ul className="mb-8 flex-1 space-y-2.5 text-sm">
              <PricingFeature text="Up to 30 animals" />
              <PricingFeature text="3 fields / parcels" />
              <PricingFeature text="Health alerts (push + email)" />
              <PricingFeature text="Milk tracking + vaccinations" />
              <PricingFeature text="Unlimited AI chat" />
              <PricingFeature text="Monthly PDF report" />
              <PricingFeature text="No real-time IoT diagnostics" disabled />
              <PricingFeature text="Single user only" disabled />
            </ul>
            <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
              <Link to="/auth/sign-up">Try 14 days →</Link>
            </Button>
          </div>

          {/* PRO — highlighted */}
          <div className="relative flex flex-col rounded-3xl border-2 border-primary bg-gradient-to-b from-primary/8 to-white/80 backdrop-blur-sm p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card/2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                Most popular
              </span>
            </div>
            <div className="mb-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
                <Zap className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">Pro</h3>
              <p className="text-sm text-muted-foreground">Growing farm</p>
            </div>
            <div className="mb-1">
              <span className="font-display text-4xl font-bold text-primary">79 DT</span>
              <span className="text-sm text-muted-foreground"> / month</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">≈ €25 · or 749 DT/year (−21%)</p>
            <div className="mb-5 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning flex items-center gap-2">
              <Sparkles className="size-3.5" /> 21-day free trial included
            </div>
            <ul className="mb-8 flex-1 space-y-2.5 text-sm">
              <PricingFeature text="Up to 200 animals" />
              <PricingFeature text="Unlimited fields" />
              <PricingFeature text="IoT diagnostics + real-time XGBoost" />
              <PricingFeature text="Per-animal health score" />
              <PricingFeature text="Full herd dashboard" />
              <PricingFeature text="Sale catalogues PDF + QR code" />
              <PricingFeature text="Robots / drones / telemetry" />
              <PricingFeature text="Up to 5 users" />
            </ul>
            <Button asChild variant="gradient" className="w-full rounded-xl font-semibold shadow-soft">
              <Link to="/auth/sign-up">Try 21 days →</Link>
            </Button>
          </div>

          {/* ENTERPRISE */}
          <div className="relative flex flex-col rounded-3xl border border-border/60 bg-white/70 backdrop-blur-sm p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
            <div className="mb-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <Bot className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">Enterprise</h3>
              <p className="text-sm text-muted-foreground">Large farm / cooperative</p>
            </div>
            <div className="mb-1">
              <span className="font-display text-4xl font-bold text-primary">Custom</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">From 299 DT/month</p>
            <div className="mb-5 rounded-xl bg-warning/10 px-3 py-2 text-xs font-semibold text-warning flex items-center gap-2">
              <Sparkles className="size-3.5" /> Personalised demo
            </div>
            <ul className="mb-8 flex-1 space-y-2.5 text-sm">
              <PricingFeature text="Unlimited animals" />
              <PricingFeature text="Multi-farm / multi-site" />
              <PricingFeature text="API & custom integrations" />
              <PricingFeature text="Adaptive baseline per animal" />
              <PricingFeature text="SLA + priority support" />
              <PricingFeature text="Auto vet reports" />
              <PricingFeature text="Unlimited users + roles" />
              <PricingFeature text="Dedicated onboarding" />
            </ul>
            <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
              <a href="#contact">Contact the team →</a>
            </Button>
          </div>
        </div>

      </section>

      {/* ─── CONTACT US ──────────────────────────────────────────── */}
      <section id="contact" className="container py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's Talk"
            description="Have questions or feedback? We'd love to hear from you. Reach out anytime and we'll get back to you as soon as possible."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-3xl border border-green-400/40 bg-green-500/10 backdrop-blur-sm p-6 text-center animate-slide-left" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-center size-12 rounded-full bg-gradient-brand text-white mx-auto mb-3 animate-scale-pulse">
                <Mail className="size-5" />
              </div>
              <h3 className="font-semibold text-sm text-ink mb-2">Email</h3>
              <a href="mailto:fidely@gmail.com" className="text-green-600 hover:text-green-700 font-medium text-xs transition-colors">
                fidely@gmail.com
              </a>
            </div>

            <div className="rounded-3xl border border-green-400/40 bg-green-500/10 backdrop-blur-sm p-6 text-center animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-center size-12 rounded-full bg-gradient-brand text-white mx-auto mb-3 animate-scale-pulse" style={{ animationDelay: '50ms' }}>
                <Phone className="size-5" />
              </div>
              <h3 className="font-semibold text-sm text-ink mb-2">Phone</h3>
              <a href="tel:+21656246292" className="text-green-600 hover:text-green-700 font-medium text-xs transition-colors">
                +216 56 246 292
              </a>
            </div>

            <div className="rounded-3xl border border-green-400/40 bg-green-500/10 backdrop-blur-sm p-6 text-center animate-slide-right" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-center size-12 rounded-full bg-gradient-brand text-white mx-auto mb-3 animate-scale-pulse" style={{ animationDelay: '100ms' }}>
                <MapPin className="size-5" />
              </div>
              <h3 className="font-semibold text-sm text-ink mb-2">Location</h3>
              <p className="text-muted-foreground text-xs">Tunis, Ariana</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-green-400/40 bg-green-500/10 backdrop-blur-sm p-8 shadow-card">
            <h3 className="font-display text-2xl font-bold text-ink mb-5">Send us a Message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-email" className="block text-sm font-semibold text-ink mb-2">
                  Your Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={contactLoading}
                  className="bg-white/50"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-ink mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder="Tell us what's on your mind..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={contactLoading}
                  rows={5}
                  className="w-full rounded-lg border border-green-400/40 bg-white/50 px-4 py-3 text-sm text-ink placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
              <Button type="submit" disabled={contactLoading} size="lg" className="w-full bg-gradient-brand text-white hover:opacity-90">
                <Send className="size-4 mr-2" />
                {contactLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── ABOUT US ────────────────────────────────────────────── */}
      <section id="about" className="border-y border-border/60 bg-white/40 backdrop-blur-sm py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Meet the team"
            title="Innovators from ESPRIT"
            description="Five passionate Mobile Engineering students united by a vision to transform agriculture through technology."
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-ink">Who We Are</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are a collective of five innovative <span className="font-semibold text-ink">Mobile Engineering students</span> from <span className="font-semibold text-ink">ESPRIT</span>, based in Tunis, Ariana. Our mission is to create cutting-edge solutions that empower farmers with technology.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-green-600" />
                  <span className="text-ink font-medium">Tunis, Ariana</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-green-600" />
                  <a href="mailto:fidely@gmail.com" className="text-ink hover:text-green-600 font-medium">fidely@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-green-600" />
                  <a href="tel:+21656246292" className="text-ink hover:text-green-600 font-medium">+216 56 246 292</a>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-brand/20 rounded-3xl blur-3xl" />
              <div className="relative">
                <EspritMap />
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="mt-8">
            <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">Our Team Members</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {TEAM_MEMBERS.map((member, idx) => (
                <div
                  key={member.id}
                  className="group text-center animate-fade-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative mx-auto mb-4 h-40 w-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-brand/30 rounded-full blur-2xl group-hover:blur-3xl transition-all animate-glow-pulse" />
                    <div className="relative size-36 rounded-full border-4 border-gradient-brand overflow-hidden shadow-lg group-hover:shadow-2xl transition-all animate-scale-pulse" style={{ animationDelay: `${idx * 150}ms` }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <h4 className="font-display text-lg font-bold text-ink">{member.name}</h4>
                  <p className="text-green-600 font-semibold text-sm mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 text-center sm:p-12 transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(28,90,44,0.82) 0%, rgba(18,140,116,0.75) 50%, rgba(30,160,80,0.80) 100%)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 24px 80px rgba(48,148,72,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {/* Frosted inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.30),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-white/20 blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/5 blur-3xl animate-blob" style={{ animationDelay: '-6s' }} />
          <div className="relative space-y-5">
            <Zap className="mx-auto size-10 text-white" />
            <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
              Your farm’s next chapter starts today.
            </h2>
            <p className="mx-auto max-w-xl text-white/85">
              Join the farmers turning soil, sky and silicon into one productive system.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
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
      <Footer />
    </AuroraBackground>
  );
}

function PricingFeature({ text, disabled }: { text: string; disabled?: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${disabled ? 'opacity-40' : ''}`}>
      <span className={`mt-0.5 shrink-0 text-base ${disabled ? 'text-muted-foreground' : 'text-primary'}`}>
        {disabled ? '✕' : '✓'}
      </span>
      <span className={disabled ? 'text-muted-foreground line-through' : 'text-ink'}>{text}</span>
    </li>
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
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-2xl font-black text-ink sm:text-4xl leading-tight">{title}</h2>
      {description ? (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}

export default LandingPage;
