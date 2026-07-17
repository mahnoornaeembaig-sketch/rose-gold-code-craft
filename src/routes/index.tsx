import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

export const Route = createFileRoute("/")({
  component: Index,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal relative px-6 py-28 md:px-12 lg:px-20 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] text-primary">
      <span className="h-px w-10 bg-primary/50" />
      <span className="font-serif italic text-primary/90">{n}</span>
      <span className="text-parchment/70">{children}</span>
      <span className="h-px w-10 bg-primary/50" />
    </div>
  );
}

function Sparkle({ style, delay = 0, size = 6 }: { style?: React.CSSProperties; delay?: number; size?: number }) {
  return (
    <span
      className="sparkle"
      style={{ width: size, height: size, animationDelay: `${delay}s`, ...style }}
      aria-hidden
    />
  );
}

function SparkleField({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 2.4,
        size: 3 + Math.random() * 6,
        key: i,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s) => (
        <Sparkle
          key={s.key}
          delay={s.delay}
          size={s.size}
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setW(value); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="mt-6">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-parchment/60">
        <span>{label}</span>
        <span className="text-primary font-serif italic normal-case tracking-normal">{value}%</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-parchment/10">
        <div
          className="h-full rounded-full transition-[width] duration-[1600ms] ease-out"
          style={{
            width: `${w}%`,
            background: "linear-gradient(90deg, #E8CB8A, var(--royal-gold), var(--velvet-rose))",
            boxShadow: "0 0 12px rgba(197,160,89,0.7)",
          }}
        />
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-primary/50 bg-parchment/5 px-5 py-2 text-xs uppercase tracking-[0.22em] text-parchment/90 transition-all duration-300 hover:border-primary hover:bg-primary/15 hover:text-primary">
      {children}
    </span>
  );
}

type Project = {
  title: string;
  code: string;
  desc: string;
  url: string;
  contribution: number;
  verified?: boolean;
  stack: string[];
  collaborators: string[];
};

const projects: Project[] = [
  {
    title: "The Cheesecake Method",
    code: "N° 01",
    desc: "Client-verified web experience shipped end-to-end. Structured, responsive, and deployed to production on Vercel.",
    url: "https://thecheesecakemethod.vercel.app/",
    contribution: 90,
    verified: true,
    stack: ["Web", "Frontend", "Deploy"],
    collaborators: ["Mahnoor Naeem"],
  },
  {
    title: "Library Management System",
    code: "N° 02",
    desc: "A C-based library management system built around clean data structures, file I/O, and menu-driven operations.",
    url: "https://github.com/mahnoornaeembaig-sketch/LIBRARY_MANAGEMENT_SYSTEM_C-",
    contribution: 100,
    stack: ["C", "Data Structures", "CLI"],
    collaborators: ["Mahnoor Naeem"],
  },
  {
    title: "Flight Reservation System",
    code: "N° 03",
    desc: "End-to-end reservation flow: bookings, seat allocation, and persistent records — modeled with OOP principles.",
    url: "https://github.com/mahnoornaeembaig-sketch/FLIGHT-RESERVATION-SYSTEM",
    contribution: 100,
    stack: ["C++", "OOP", "Systems"],
    collaborators: ["Mahnoor Naeem"],
  },
];

const skills = ["C", "C++", "Python", "SQL", "Object-Oriented Programming", "Data Structures"];

function Index() {
  const [sent, setSent] = useState(false);

  // --- Supabase States ---
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Restore session on load + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // --- Fetch Approved Reviews ---
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('client_reviews')
        .select('*')
        .eq('is_approved', true); // Only fetch the ones you set to 'true'
      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setApprovedReviews(data || []);
      }
    };
    fetchReviews();
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    (e.currentTarget as HTMLFormElement).reset();
  }

  // --- Handle Client Login ---
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage('Authenticating...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setStatusMessage(`Error: ${error.message}`);
    } else {
      setSession(data.session);
      setStatusMessage(''); // Clear message on success
    }
  };

  // --- Handle Google OAuth Login ---
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This sends the user back to your site after login
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  // --- Handle Client Logout ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStatusMessage('');
  };

  // --- Handle Review Submission ---
  async function onReviewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage('Submitting review...');

    // Grab the values directly from the HTML form inputs
    const formData = new FormData(e.currentTarget);
    const clientName = formData.get("reviewer-name") as string;
    const projectName = formData.get("review-project") as string;
    const reviewText = formData.get("review-message") as string;

    const { error } = await supabase
      .from('client_reviews')
      .insert([
        {
          client_name: clientName,
          project_name: projectName,
          review_text: reviewText,
          is_approved: false
        }
      ]);

    if (error) {
      setStatusMessage(`Error: ${error.message}`);
    } else {
      setStatusMessage('✦ thank you — your review is pending approval');
      (e.currentTarget as HTMLFormElement).reset();
    }
  }

  return (
    <main className="relative min-h-screen text-foreground">
      {/* Floating minimalist nav */}
      <header className="fixed left-1/2 top-5 z-50 -translate-x-1/2">
        <div
          className="glass flex items-center gap-2 rounded-full px-3 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] md:gap-4 md:px-5"
          style={{ borderImage: "linear-gradient(135deg, rgba(197,160,89,0.7), rgba(253,245,230,0.4)) 1" }}
        >
          <a href="#top" className="flex items-center gap-2 pr-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#E8CB8A] to-[var(--royal-gold)] font-serif text-sm text-[#2E0202]">
              M
            </span>
            <span className="hidden font-script text-lg text-parchment sm:inline">Mahnoor</span>
          </a>
          <nav className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-parchment/80 sm:gap-2 md:gap-3 md:text-[11px]">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Work", "#projects"],
              ["Reviews", "#reviews"],
              ["Edu", "#education"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-primary/20 hover:text-primary md:px-4"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden px-6 pt-40 pb-32 md:px-12 md:pt-44 lg:px-20 lg:pt-48">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full opacity-40 blur-[120px]" style={{ background: "radial-gradient(circle, var(--velvet-rose), transparent 70%)" }} />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-30 blur-[120px]" style={{ background: "radial-gradient(circle, var(--royal-gold), transparent 70%)" }} />

        <SparkleField count={22} />

        <div className="relative mx-auto max-w-4xl">
          <div
            className="reveal in-view glass rounded-[28px] px-6 py-14 text-center sm:px-8 md:px-16 md:py-20"
            style={{
              boxShadow:
                "0 0 0 1px rgba(197,160,89,0.35), 0 0 60px -10px rgba(197,160,89,0.35), 0 30px 80px -30px rgba(0,0,0,0.7)",
            }}
          >
            <div className="mb-6 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span>Available for engineering roles</span>
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.1] tracking-wide text-charcoal sm:text-6xl md:text-7xl lg:text-8xl">
              <span style={{ color: "var(--charcoal)" }}>Mahnoor Naeem</span>
            </h1>

            <div className="mx-auto my-8 h-px w-40 gold-hairline" />

            <p className="mx-auto max-w-xl px-2 pb-2 font-serif text-base italic leading-relaxed text-parchment/85 sm:text-lg md:text-xl">
              Computer Engineering Student
              <span className="text-primary"> · </span>
              Aspiring Software Engineer
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#projects"
                className="cta-glow inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#2E0202]"
                style={{ background: "linear-gradient(135deg, #E8CB8A 0%, var(--royal-gold) 100%)" }}
              >
                View Proof of Work
                <span aria-hidden>→</span>
              </a>
              <a
                href="#contact"
                className="cta-glow inline-flex items-center gap-3 rounded-full border border-primary/60 bg-transparent px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-parchment hover:text-primary"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["03", "Shipped Projects"],
              ["06", "Core Skills"],
              ["100%", "Delivery Rate"],
              ["01", "Client Verified"],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary">
                <div className="font-serif text-3xl text-gold-gradient">{v}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-parchment/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel n="I.">About</SectionLabel>
          <h2 className="mx-auto max-w-3xl font-serif text-3xl font-normal leading-tight md:text-5xl">
            Ever since I first met a computer, I've been enchanted by what makes technology work
            <span className="font-script text-primary"> beneath the surface</span>.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base text-parchment/75 md:text-lg">
            I am deeply interested in programming and enjoy the process of breaking down complex problems
            into elegant, efficient solutions.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
            {[
              ["Focus", "Systems & Software"],
              ["Location", "Karachi, PK"],
              ["Status", "Open to work"],
            ].map(([k, v]) => (
              <div key={k} className="glass rounded-2xl p-5">
                <div className="text-[10px] uppercase tracking-[0.28em] text-parchment/60">{k}</div>
                <div className="mt-2 font-serif text-lg text-primary">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel n="II.">Skills</SectionLabel>
          <h3 className="font-serif text-3xl font-normal md:text-4xl">
            A toolkit built for <span className="font-script text-primary">systems thinking</span>.
          </h3>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {skills.map((s) => (<Pill key={s}>{s}</Pill>))}
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <SectionLabel n="III.">Proof of Work</SectionLabel>
            <h2 className="font-serif text-4xl font-normal md:text-5xl">
              Selected <span className="font-script text-primary">Projects</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="cta-glow group glass relative flex flex-col justify-between rounded-3xl p-7"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-serif text-sm italic text-primary">{p.code}</span>
                    {p.verified && (
                      <span
                        className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-[#2E0202]"
                        style={{ background: "linear-gradient(135deg, #E8CB8A, var(--velvet-rose))" }}
                      >
                        ✦ Client Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-medium leading-tight transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-parchment/75">{p.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="rounded-full border border-primary/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-parchment/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mt-6 border-t border-primary/25 pt-5">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-parchment/60">
                      Collaborators
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.collaborators.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1.5 rounded-full border border-velvet-rose/60 bg-white/60 px-2.5 py-1 text-[10px] font-medium tracking-wide text-charcoal"
                          style={{ color: "var(--charcoal)" }}
                        >
                          <span
                            aria-hidden
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ background: "var(--velvet-rose)" }}
                          />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ProgressBar value={p.contribution} label="Based on total team commits" />
                  <div className="mt-6 flex items-center justify-between border-t border-primary/25 pt-4 text-[10px] uppercase tracking-[0.28em]">
                    <span className="text-parchment/70">Open Project</span>
                    <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <a
              href="#reviews"
              className="cta-glow inline-flex items-center gap-3 rounded-full border border-primary bg-transparent px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-primary hover:bg-primary/15"
            >
              Submit Client Review
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </Section>

      {/* Education */}
      <Section id="education">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel n="IV.">Education</SectionLabel>
            <h3 className="font-serif text-3xl font-normal md:text-4xl">
              A journey through <span className="font-script text-primary">learning</span>.
            </h3>
          </div>

          <ul className="mt-12 space-y-5">
            {[
              {
                place: "NED University of Engineering & Technology",
                detail: "Computer Systems Engineering — Batch 2025",
                meta: "Undergraduate",
              },
              {
                place: "BAMM P.E.C.H.S Govt College for Women",
                detail: "Intermediate — Pre-Engineering",
                meta: "Higher Secondary",
              },
              {
                place: "St. Patrick's Girls High School",
                detail: "Matriculation — Science",
                meta: "Secondary",
              },
            ].map((e) => (
              <li
                key={e.place}
                className="glass cta-glow relative flex items-start gap-5 rounded-2xl p-6 pl-14"
              >
                <span
                  className="absolute left-5 top-6 text-xl"
                  style={{ filter: "drop-shadow(0 0 6px rgba(197,160,89,0.7))" }}
                  aria-hidden
                >
                  ✨
                </span>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary">{e.meta}</div>
                  <div className="mt-2 font-serif text-lg font-medium md:text-xl">{e.place}</div>
                  <p className="mt-1 font-serif italic text-sm text-parchment/80 md:text-base">
                    {e.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Client Reviews */}
      <Section id="reviews">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <SectionLabel n="V.">Client Reviews</SectionLabel>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-normal leading-tight md:text-5xl">
              Kind words from <span className="font-script text-primary">people I've built for</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-parchment/75 md:text-lg">
              Real feedback from clients and collaborators. Submissions are reviewed before publishing.
            </p>
          </div>

          {/* Approved testimonials grid — live from Supabase */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {approvedReviews.length === 0 ? (
              <p className="col-span-full text-center font-serif italic text-sm text-parchment/60">
                No approved reviews yet — check back soon.
              </p>
            ) : (
              approvedReviews.map((t) => (
                <figure
                  key={t.id}
                  className="glass cta-glow relative flex flex-col rounded-3xl p-8"
                >
                  <span
                    aria-hidden
                    className="absolute left-6 top-4 font-serif text-6xl leading-none text-primary/40"
                  >
                    "
                  </span>
                  <blockquote className="mt-6 font-serif text-base italic leading-relaxed text-parchment/85 md:text-lg">
                    {t.review_text}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-primary/25 pt-4">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-full font-serif text-sm"
                      style={{
                        background: "linear-gradient(135deg, var(--velvet-rose), var(--royal-gold))",
                        color: "#FFFFFF",
                      }}
                      aria-hidden
                    >
                      {t.client_name?.charAt(0) ?? "?"}
                    </span>
                    <div>
                      <div className="font-serif text-base font-medium">{t.client_name}</div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-parchment/60">
                        {t.project_name}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              ))
            )}
          </div>

          {/* Submit-a-review form */}
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="glass rounded-3xl p-8 lg:col-span-4">
              <div className="font-script text-3xl text-primary">Worked together?</div>
              <p className="mt-3 text-sm text-parchment/80">
                Share your experience. Submitted reviews are moderated and only published with your consent.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-parchment/75">
                <li>· Honest, specific feedback welcome</li>
                <li>· Include the project we worked on</li>
                <li>· Approval usually within a few days</li>
              </ul>
              {session && (
                <button
                  onClick={handleLogout}
                  className="mt-6 text-[10px] uppercase tracking-[0.28em] text-parchment/60 hover:text-primary underline"
                >
                  Log out
                </button>
              )}
            </div>

            {!session ? (
              <div className="glass rounded-3xl p-8 lg:col-span-8 flex flex-col justify-center items-center">
                <div className="font-script text-3xl text-primary mb-6">Secure Client Login</div>
                <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
                  <input
                    type="email"
                    placeholder="Client Email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    style={{ color: "var(--charcoal)" }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    style={{ color: "var(--charcoal)" }}
                    required
                  />
                  <button
                    type="submit"
                    className="cta-glow w-full rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-[#2E0202] mt-4"
                    style={{ background: "linear-gradient(135deg, #E8CB8A 0%, var(--royal-gold) 100%)" }}
                  >
                    Access Portal
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full rounded-full border border-primary/40 bg-white/5 px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-parchment hover:bg-white/10 mt-2 transition-all"
                  >
                    Sign in with Google
                  </button>
                </form>
                {statusMessage && <p className="mt-6 font-serif italic text-xs text-primary">{statusMessage}</p>}
              </div>
            ) : (
              <form
                onSubmit={onReviewSubmit}
                className="glass rounded-3xl p-8 lg:col-span-8"
                aria-label="Submit a client review"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">
                      Your name
                    </span>
                    <input
                      required
                      name="reviewer-name"
                      maxLength={100}
                      className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      style={{ color: "var(--charcoal)" }}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">
                      Company / Role
                    </span>
                    <input
                      name="reviewer-role"
                      maxLength={120}
                      className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      style={{ color: "var(--charcoal)" }}
                    />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">
                    Project we worked on
                  </span>
                  <input
                    name="review-project"
                    maxLength={120}
                    className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    style={{ color: "var(--charcoal)" }}
                  />
                </label>
                <label className="mt-5 block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">
                    Your review
                  </span>
                  <textarea
                    required
                    name="review-message"
                    rows={5}
                    maxLength={1000}
                    className="w-full resize-none rounded-2xl border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    style={{ color: "var(--charcoal)" }}
                  />
                </label>
                <label className="mt-5 flex items-start gap-3 text-xs text-parchment/80">
                  <input
                    type="checkbox"
                    required
                    name="review-consent"
                    className="mt-1 h-4 w-4 rounded border-primary/50 accent-[color:var(--velvet-rose)]"
                  />
                  <span>
                    I consent to my name and review being displayed publicly once approved.
                  </span>
                </label>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="font-serif italic text-xs text-primary">
                    {statusMessage || "reviewed with care before publishing"}
                  </span>
                  <button
                    type="submit"
                    className="cta-glow inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.28em]"
                    style={{
                      background: "linear-gradient(135deg, var(--velvet-rose) 0%, var(--royal-gold) 100%)",
                      color: "#FFFFFF",
                    }}
                  >
                    Submit Review
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <SectionLabel n="VI.">Contact</SectionLabel>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-normal leading-tight md:text-6xl">
              Let's build <span className="font-script text-primary">something exquisite</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-parchment/75 md:text-lg">
              Open to internships, collaborations, and client engineering work. Send a note — I read every message.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="glass rounded-3xl p-8 lg:col-span-5">
              <div className="font-script text-3xl text-primary">Say hello</div>
              <p className="mt-3 text-sm text-parchment/75">
                Find me across the web — replies are prompt and thoughtful.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href="https://github.com/mahnoornaeembaig-sketch"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-glow flex items-center justify-between rounded-full border border-primary/50 px-5 py-3 text-[11px] uppercase tracking-[0.28em] hover:text-primary"
                >
                  <span>GitHub</span><span>↗</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mahnoor-naeem-baig/"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-glow flex items-center justify-between rounded-full border border-primary/50 px-5 py-3 text-[11px] uppercase tracking-[0.28em] hover:text-primary"
                >
                  <span>LinkedIn</span><span>↗</span>
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="glass rounded-3xl p-8 lg:col-span-7">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">Name</span>
                  <input required name="name" className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">Email</span>
                  <input required type="email" name="email" className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary" />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">Subject</span>
                <input name="subject" className="w-full rounded-full border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </label>
              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-parchment/70">Message</span>
                <textarea required name="message" rows={5} className="w-full resize-none rounded-2xl border border-primary/40 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary" />
              </label>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className={`font-serif italic text-xs ${sent ? "text-primary" : "text-parchment/60"}`}>
                  {sent ? "✦ message queued with care" : "sealed & sent with intention"}
                </span>
                <button
                  type="submit"
                  className="cta-glow inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-[#2E0202]"
                  style={{ background: "linear-gradient(135deg, #E8CB8A 0%, var(--royal-gold) 100%)" }}
                >
                  Send Message
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <footer className="border-t border-primary/25 px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-[0.28em] text-parchment/60 md:flex-row">
          <span className="font-serif italic normal-case tracking-wide">
            © {new Date().getFullYear()} Mahnoor Naeem — crafted with care.
          </span>
          <div className="flex gap-6">
            <a href="https://github.com/mahnoornaeembaig-sketch" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href="https://www.linkedin.com/in/mahnoor-naeem-baig/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </footer>
    </main>
  );
}