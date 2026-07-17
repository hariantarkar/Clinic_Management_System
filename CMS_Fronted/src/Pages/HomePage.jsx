import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// --- Inline icon components (no external icon library needed) ---

const IconPulse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h4l2 7 4-14 2 7h8" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c0-4.1 3.4-6.8 7.5-6.8s7.5 2.7 7.5 6.8" />
  </svg>
);

const IconStethoscope = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3v6a4 4 0 0 0 8 0V3" />
    <path d="M9 13v2a6 6 0 0 0 12 0v-2.5" />
    <circle cx="20" cy="9.5" r="1.8" />
  </svg>
);

const IconShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
    <path d="M9 12.2l2 2 4-4.4" />
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const IconKeyRound = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="3.4" />
    <path d="M10.4 12.6 19 4" />
    <path d="M15.4 8 18 5.4" />
    <path d="M17.4 10 20 7.4" />
  </svg>
);

const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 9 17 20 6" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

// Animated EKG divider — the page's one signature element. A live trace that
// "confirms the system is running," echoed in miniature by the status pill
// in the navbar and hero.
const PulseDivider = () => (
  <div className="hp-pulse-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="hp-pulse-svg">
      <path
        className="hp-pulse-track"
        d="M0,40 L280,40 L310,40 L330,10 L350,70 L370,15 L390,40 L420,40 L1200,40"
      />
      <path
        className="hp-pulse-line"
        d="M0,40 L280,40 L310,40 L330,10 L350,70 L370,15 L390,40 L420,40 L1200,40"
      />
    </svg>
  </div>
);

const roles = [
  {
    key: "patient",
    icon: <IconUser />,
    tag: "Patient",
    title: "Book on your terms",
    desc:
      "Search doctors by name or specialization, pick an exact time inside a slot instead of a vague window, and keep prescriptions and visit history in one place.",
    bullets: ["Exact-time slot booking", "Upcoming vs. missed appointments", "Prescription & medicine history"],
  },
  {
    key: "doctor",
    icon: <IconStethoscope />,
    tag: "Doctor",
    title: "Run your day, not your inbox",
    desc:
      "Manage slots, see upcoming consultations at a glance, and issue prescriptions without leaving the appointment screen.",
    bullets: ["Slot & availability management", "Consultation history per patient", "In-flow prescriptions"],
  },
  {
    key: "admin",
    icon: <IconShieldCheck />,
    tag: "Admin",
    title: "Approve, oversee, report",
    desc:
      "Every doctor account is reviewed before it goes live. Track daily stats per doctor and pull revenue by date range whenever finance asks.",
    bullets: ["Admin-gated doctor onboarding", "Daily appointment stats", "Revenue by doctor & date range"],
  },
];

const steps = [
  {
    n: "01",
    title: "Find & book",
    desc: "Search by specialization, view a doctor's open slots, and reserve the exact time that works — not just the nearest window.",
  },
  {
    n: "02",
    title: "Get confirmed",
    desc: "The slot locks in immediately. No double-booking, no waiting on a callback to know it's set.",
  },
  {
    n: "03",
    title: "Consult & follow up",
    desc: "Meet your doctor, walk away with a prescription already logged in your history — ready for the next visit.",
  },
];

const features = [
  {
    icon: <IconClock />,
    title: "Exact-time booking",
    desc: "Pick 4:00, 4:30, or 5:00 within a slot — the backend validates against the duration grid and blocks clashes.",
  },
  {
    icon: <IconShieldCheck />,
    title: "Admin-gated onboarding",
    desc: "A doctor sign-up is a request, not an account. Login is blocked until an admin approves the profile.",
  },
  {
    icon: <IconKeyRound />,
    title: "Self-service password reset",
    desc: "A 5-minute OTP emailed on request — reset your own password without waiting on an admin.",
  },
  {
    icon: <IconBarChart />,
    title: "Revenue, sliced your way",
    desc: "Total revenue, by doctor, by date range, or both at once — no exports, no spreadsheets.",
  },
];

// Demo data for the interactive hero widget — mirrors the real
// doctorsSlot/{doctorId}/availability + book/{slotId}/{patientId} flow,
// just running against local state instead of the API.
const demoSlots = ["3:00", "3:30", "4:00", "4:30", "5:00", "5:30"];
const demoBooked = ["4:00"];

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoSelected, setDemoSelected] = useState(null);
  const [demoStatus, setDemoStatus] = useState("idle"); // idle | confirming | confirmed

  const handleDemoPick = (slot) => {
    if (demoBooked.includes(slot) || demoStatus !== "idle") return;
    setDemoSelected(slot);
    setDemoStatus("confirming");
    setTimeout(() => setDemoStatus("confirmed"), 550);
  };

  const resetDemo = () => {
    setDemoSelected(null);
    setDemoStatus("idle");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="hp-page">
      {/* Navbar */}
      <header className={`hp-nav ${scrolled ? "hp-nav--scrolled" : ""}`}>
        <div className="hp-nav-inner">
          <button className="hp-brand" onClick={() => scrollTo("hp-top")} aria-label="Clinic CMS home">
            <span className="hp-brand-mark">
              <IconPulse />
            </span>
            <span className="hp-brand-text">
              Clinic<span className="hp-brand-accent">CMS</span>
            </span>
          </button>

          <nav className="hp-nav-links">
            <button onClick={() => scrollTo("hp-roles")}>Roles</button>
            <button onClick={() => scrollTo("hp-how")}>How it works</button>
            <button onClick={() => scrollTo("hp-features")}>Features</button>
          </nav>

          <div className="hp-nav-right">
            <span className="hp-status-pill">
              <span className="hp-status-dot" />
              All systems live
            </span>
            <button className="hp-btn hp-btn--ghost" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button className="hp-btn hp-btn--primary hp-btn--sm" onClick={() => navigate("/register")}>
              Get started
            </button>
          </div>

          <button className="hp-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="hp-mobile-menu">
            <button onClick={() => scrollTo("hp-roles")}>Roles</button>
            <button onClick={() => scrollTo("hp-how")}>How it works</button>
            <button onClick={() => scrollTo("hp-features")}>Features</button>
            <div className="hp-mobile-actions">
              <button className="hp-btn hp-btn--ghost" onClick={() => navigate("/login")}>
                Sign in
              </button>
              <button className="hp-btn hp-btn--primary" onClick={() => navigate("/register")}>
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="hp-top">
        {/* Hero */}
        <section className="hp-hero">
          <div className="hp-hero-grid" aria-hidden="true" />
          <div className="hp-hero-inner">
            <div className="hp-hero-copy">
              <span className="hp-eyebrow">Clinic operating system</span>
              <h1 className="hp-h1">
                One system,
                <br />
                every seat in the clinic.
              </h1>
              <p className="hp-sub">
                Clinic CMS gives patients an exact time to book, doctors a clear schedule to run,
                and admins full control over who's on staff and what's coming in. No double-booked
                slots, no rogue doctor accounts, no revenue guesswork.
              </p>
              <div className="hp-hero-cta">
                <button className="hp-btn hp-btn--primary hp-btn--lg" onClick={() => navigate("/register")}>
                  Get started
                  <IconArrowRight />
                </button>
                <button className="hp-btn hp-btn--outline hp-btn--lg" onClick={() => navigate("/login")}>
                  Sign in
                </button>
              </div>
              <p className="hp-hero-note">
                Registering as a doctor? <a onClick={() => navigate("/register")}>Sign up here</a> — your
                profile goes live once an admin reviews it.
              </p>
            </div>

            <div className="hp-hero-panel">
              <div className="hp-panel-head">
                <span>Try a booking</span>
                <span className="hp-status-dot hp-status-dot--panel" />
              </div>

              <div className="hp-demo-doctor">
                <div className="hp-demo-avatar">
                  <IconStethoscope />
                </div>
                <div>
                  <div className="hp-demo-doctor-name">Dr.Hari Antarkar </div>
                  <div className="hp-demo-doctor-role">Ophthalmology (Eye Specialist)· 30-min slots</div>
                </div>
                <div className="hp-demo-date">
                  <IconCalendar />
                  Today
                </div>
              </div>

              {demoStatus !== "confirmed" ? (
                <>
                  <div className="hp-demo-grid">
                    {demoSlots.map((slot) => {
                      const isBooked = demoBooked.includes(slot);
                      const isSelected = demoSelected === slot;
                      return (
                        <button
                          key={slot}
                          className={`hp-demo-slot ${isBooked ? "hp-demo-slot--booked" : ""} ${
                            isSelected ? "hp-demo-slot--selected" : ""
                          }`}
                          onClick={() => handleDemoPick(slot)}
                          disabled={isBooked}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <p className="hp-demo-hint">
                    {demoStatus === "confirming"
                      ? "Locking in your slot…"
                      : "Tap an open time — this is exactly how patients book."}
                  </p>
                </>
              ) : (
                <div className="hp-demo-confirmed">
                  <span className="hp-demo-check">
                    <IconCheck />
                  </span>
                  <div>
                    <div className="hp-demo-confirmed-title">Slot reserved for {demoSelected}</div>
                    <div className="hp-demo-confirmed-sub">
                      That's the whole flow — instant, exact-time, no back-and-forth.
                    </div>
                  </div>
                  <button className="hp-demo-again" onClick={resetDemo}>
                    Try another time
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <PulseDivider />

        {/* Roles */}
        <section id="hp-roles" className="hp-section">
          <div className="hp-section-head">
            <span className="hp-eyebrow">Roles &amp; access</span>
            <h2 className="hp-h2">Built for every seat at the clinic</h2>
            <p className="hp-section-sub">
              One `register` table, three distinct experiences — enforced at the routing layer, not
              just hidden in the UI.
            </p>
          </div>

          <div className="hp-roles-grid">
            {roles.map((r) => (
              <article className="hp-role-card" key={r.key}>
                <div className="hp-role-icon">{r.icon}</div>
                <span className="hp-role-tag">{r.tag}</span>
                <h3 className="hp-role-title">{r.title}</h3>
                <p className="hp-role-desc">{r.desc}</p>
                <ul className="hp-role-bullets">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="hp-how" className="hp-section hp-section--tint">
          <div className="hp-section-head">
            <span className="hp-eyebrow">For patients</span>
            <h2 className="hp-h2">From search to prescription in three steps</h2>
          </div>

          <div className="hp-steps">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="hp-step">
                  <span className="hp-step-n">{s.n}</span>
                  <h3 className="hp-step-title">{s.title}</h3>
                  <p className="hp-step-desc">{s.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="hp-step-connector" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="hp-features" className="hp-section">
          <div className="hp-section-head">
            <span className="hp-eyebrow">Under the hood</span>
            <h2 className="hp-h2">The details that keep it trustworthy</h2>
          </div>

          <div className="hp-features-grid">
            {features.map((f) => (
              <div className="hp-feature-card" key={f.title}>
                <div className="hp-feature-icon">{f.icon}</div>
                <h3 className="hp-feature-title">{f.title}</h3>
                <p className="hp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="hp-cta-band">
          <div className="hp-cta-inner">
            <h2 className="hp-cta-title">Ready to bring your clinic online?</h2>
            <p className="hp-cta-sub">Create an account as a patient, or register your practice as a doctor.</p>
            <div className="hp-cta-actions">
              <button className="hp-btn hp-btn--primary hp-btn--lg" onClick={() => navigate("/register")}>
                Create account
                <IconArrowRight />
              </button>
              <button className="hp-btn hp-btn--outline-light hp-btn--lg" onClick={() => navigate("/login")}>
                I already have an account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-brand">
            <span className="hp-brand-mark hp-brand-mark--sm">
              <IconPulse />
            </span>
            <span className="hp-brand-text">
              Clinic<span className="hp-brand-accent">CMS</span>
            </span>
            <p className="hp-footer-tagline">Appointments, prescriptions, and revenue — one system.</p>
          </div>

          <div className="hp-footer-col">
            <h4>Product</h4>
            <button onClick={() => scrollTo("hp-roles")}>Roles</button>
            <button onClick={() => scrollTo("hp-how")}>How it works</button>
            <button onClick={() => scrollTo("hp-features")}>Features</button>
          </div>

          <div className="hp-footer-col">
            <h4>Account</h4>
            <button onClick={() => navigate("/login")}>Sign in</button>
            <button onClick={() => navigate("/register")}>Create account</button>
            <button onClick={() => navigate("/forgot-password")}>Forgot password</button>
          </div>
        </div>

        <div className="hp-footer-bottom">
          <span>© {new Date().getFullYear()} Clinic CMS. Built with Spring Boot &amp; React.</span>
        </div>
      </footer>
    </div>
  );
}
