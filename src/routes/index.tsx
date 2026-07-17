import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

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
      className={`reveal border-t border-primary/20 px-6 py-24 md:px-12 lg:px-20 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
      <span>{n}</span>
      <span className="h-px flex-1 bg-primary/40" />
      <span className="text-muted-foreground">{children}</span>
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
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-[3px] w-full border border-primary/40 bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-[1600ms] ease-out"
          style={{ width: `${w}%`, boxShadow: "0 0 12px color-mix(in oklab, var(--rosegold) 60%, transparent)" }}
        />
      </div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="border border-primary/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
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
};

const projects: Project[] = [
  {
    title: "The Cheesecake Method",
    code: "PRJ_01",
    desc: "Client-verified web experience shipped end-to-end. Structured, responsive, and deployed to production on Vercel.",
    url: "https://thecheesecakemethod.vercel.app/",
    contribution: 90,
    verified: true,
    stack: ["Web", "Frontend", "Deploy"],
  },
  {
    title: "Library Management System",
    code: "PRJ_02",
    desc: "A C-based library management system built around clean data structures, file I/O, and menu-driven operations.",
    url: "https://github.com/mahnoornaeembaig-sketch/LIBRARY_MANAGEMENT_SYSTEM_C-",
    contribution: 100,
    stack: ["C", "Data Structures", "CLI"],
  },
  {
    title: "Flight Reservation System",
    code: "PRJ_03",
    desc: "End-to-end reservation flow: bookings, seat allocation, and persistent records — modeled with OOP principles.",
    url: "https://github.com/mahnoornaeembaig-sketch/FLIGHT-RESERVATION-SYSTEM",
    contribution: 100,
    stack: ["C++", "OOP", "Systems"],
  },
];

const skills = ["C", "C++", "Python", "SQL", "Object-Oriented Programming", "Data Structures"];

function Index() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-primary bg-primary font-mono text-sm font-semibold tracking-wider text-primary-foreground">
              MN
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Mahnoor / Portfolio</span>
          </a>
          <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:flex">
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#skills" className="hover:text-primary">Skills</a>
            <a href="#projects" className="hover:text-primary">Projects</a>
            <a href="#education" className="hover:text-primary">Education</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden px-6 pt-24 pb-32 md:px-12 md:pt-32 lg:px-20 lg:pt-40">
        <div className="bg-grid-emerald absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, var(--rosegold), transparent 70%)" }} />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, var(--rosegold), transparent 70%)" }} />

        <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="reveal in-view">
            <div className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Available for engineering roles</span>
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
              Mahnoor <br />
              <span className="text-primary">Naeem</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl">
              Computer Engineering Student <span className="text-primary">/</span> Aspiring Software Engineer
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href="#projects" className="cta-glow inline-flex items-center gap-3 border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">
                View Proof of Work
                <span aria-hidden>→</span>
              </a>
              <a href="#contact" className="cta-glow inline-flex items-center gap-3 border border-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground">
                Contact
              </a>
            </div>
          </div>

          {/* Monogram card */}
          <div className="reveal in-view">
            <div className="border border-primary p-3">
              <div className="grid h-56 w-56 place-items-center bg-primary md:h-72 md:w-72" style={{ boxShadow: "inset 0 0 40px color-mix(in oklab, black 25%, transparent)" }}>
                <span className="font-mono text-7xl font-semibold tracking-tight text-primary-foreground md:text-8xl">MN</span>
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span>ID / MN-001</span>
                <span className="text-primary">// verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="relative mx-auto mt-24 grid max-w-7xl grid-cols-2 border border-primary/40 md:grid-cols-4">
          {[
            ["03", "Shipped Projects"],
            ["06", "Core Competencies"],
            ["100%", "Delivery Rate"],
            ["01", "Client Verified"],
          ].map(([v, l]) => (
            <div key={l} className="border-b border-r border-primary/40 p-6 last:border-r-0 md:border-b-0">
              <div className="font-mono text-3xl text-primary">{v}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <Section id="about">
        <div className="mx-auto max-w-7xl">
          <SectionLabel n="01 /">About</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-12">
            <h2 className="col-span-12 text-3xl font-light leading-tight tracking-tight md:text-5xl lg:col-span-8">
              Ever since I first interacted with a computer, I've been fascinated by what makes technology work
              <span className="text-primary"> beneath the surface</span>.
            </h2>
            <div className="col-span-12 lg:col-span-4">
              <p className="text-base text-muted-foreground md:text-lg">
                I am deeply interested in programming and enjoy the process of breaking down complex problems into
                elegant, efficient solutions.
              </p>
              <div className="mt-8 border border-primary/40 p-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex justify-between"><span>Focus</span><span className="text-primary">Systems &amp; Software</span></div>
                <div className="mt-2 flex justify-between"><span>Location</span><span className="text-primary">Karachi, PK</span></div>
                <div className="mt-2 flex justify-between"><span>Status</span><span className="text-primary">Open to work</span></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills">
        <div className="mx-auto max-w-7xl">
          <SectionLabel n="02 /">Skills</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-light md:text-3xl">
                A toolkit built for <span className="text-primary">systems thinking</span>.
              </h3>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-3">
                {skills.map((s) => (<Pill key={s}>{s}</Pill>))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects">
        <div className="mx-auto max-w-7xl">
          <SectionLabel n="03 /">Projects / Proof of Work</SectionLabel>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col justify-between border border-primary bg-card p-6 transition-shadow duration-300 hover:shadow-[0_0_30px_-8px_color-mix(in_oklab,var(--rosegold)_60%,transparent)]"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{p.code}</span>
                    {p.verified && (
                      <span className="border border-primary bg-primary px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary-foreground">
                        Client-Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-medium leading-tight tracking-tight transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <ProgressBar value={p.contribution} label="Contribution" />
                  <div className="mt-6 flex items-center justify-between border-t border-primary/30 pt-4 font-mono text-[10px] uppercase tracking-[0.25em]">
                    <span className="text-muted-foreground">Open Project</span>
                    <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#contact"
              className="cta-glow inline-flex items-center gap-3 border border-primary bg-transparent px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Submit Client Review
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </Section>

      {/* Education */}
      <Section id="education">
        <div className="mx-auto max-w-7xl">
          <SectionLabel n="04 /">Education</SectionLabel>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-primary/40" />
            <div className="relative pl-12">
              <div className="absolute left-0 top-1.5 grid h-7 w-7 place-items-center border border-primary bg-primary">
                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">2022 — Present</div>
              <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
                B.E. in Computer Systems Engineering
              </h3>
              <p className="mt-2 text-base text-muted-foreground md:text-lg">
                NED University of Engineering and Technology
              </p>
              <div className="mt-6 inline-flex flex-wrap gap-2">
                <span className="border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Systems</span>
                <span className="border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Software</span>
                <span className="border border-primary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Algorithms</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="pb-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel n="05 /">Contact</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-light leading-tight tracking-tight md:text-6xl">
                Let's build <span className="text-primary">something precise</span>.
              </h2>
              <p className="mt-6 text-base text-muted-foreground md:text-lg">
                Open to internships, collaborations, and client engineering work. Send a note — I read every message.
              </p>
              <div className="mt-8 flex gap-3">
                <a
                  href="https://github.com/mahnoornaeembaig-sketch"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-glow border border-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/mahnoor-naeem-baig/"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-glow border border-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="border border-primary bg-card p-6 md:p-8 lg:col-span-7">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Name</span>
                  <input required name="name" className="w-full border border-primary/50 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Email</span>
                  <input required type="email" name="email" className="w-full border border-primary/50 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Subject</span>
                <input name="subject" className="w-full border border-primary/50 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="mt-5 block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</span>
                <textarea required name="message" rows={5} className="w-full resize-none border border-primary/50 bg-transparent px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${sent ? "text-primary" : "text-muted-foreground"}`}>
                  {sent ? "// message queued" : "// encrypted in transit"}
                </span>
                <button type="submit" className="cta-glow inline-flex items-center gap-3 border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground">
                  Send Message
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <footer className="border-t border-primary/20 px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Mahnoor Naeem — All systems nominal.</span>
          <div className="flex gap-6">
            <a href="https://github.com/mahnoornaeembaig-sketch" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href="https://www.linkedin.com/in/mahnoor-naeem-baig/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
