import React, { useState } from "react";
import "./LoginPage.css";

// --- Inline icon components (no external icon library needed) ---

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="3" />
    <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" />
    <path d="M2.5 21c.3-2 1.6-3.6 3.2-4.4" />
    <path d="M21.5 21c-.3-2-1.6-3.6-3.2-4.4" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
  </svg>
);

const IconEye = ({ off }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <line x1="3" y1="21" x2="21" y2="3" />}
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="13 5 20 12 13 19" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
  </svg>
);

const IconUserPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6s6.2 2.3 6.2 5.6" />
    <line x1="18.5" y1="7" x2="18.5" y2="13" />
    <line x1="15.5" y1="10" x2="21.5" y2="10" />
  </svg>
);

const IconDoctor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="3" />
    <path d="M5.5 21c0-3.6 3-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
    <path d="M9.5 14.5v2a2.5 2.5 0 0 0 5 0v-2" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your auth logic
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="cms-page">
      <div className="cms-card">
        {/* Left panel */}
        <div className="cms-panel cms-panel--left">
          <div className="cms-icon-badge cms-icon-badge--blue">
            <IconUsers />
          </div>

          <h1 className="cms-title">
            Clinic Management
            <br />
            System
          </h1>

          <p className="cms-subtext">
            Manage appointments, prescriptions, patient records, and
            consultations with a modern healthcare dashboard.
          </p>

          <div className="cms-features">
            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--blue cms-icon-badge--sm">
                <IconShield />
              </div>
              <div>
                <div className="cms-feature-title">Secure Authentication</div>
                <div className="cms-feature-desc">Protected patient and medical data.</div>
              </div>
            </div>

            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--green cms-icon-badge--sm">
                <IconDoctor />
              </div>
              <div>
                <div className="cms-feature-title">Easy Doctor Management</div>
                <div className="cms-feature-desc">Simplified appointment workflow.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="cms-panel cms-panel--right">
          <h2 className="cms-welcome">Welcome Back</h2>
          <p className="cms-welcome-sub">
            Login to continue managing your healthcare services.
          </p>

          <form onSubmit={handleSubmit} className="cms-form">
            <div className="cms-field">
              <label className="cms-label" htmlFor="email">
                Email Address
              </label>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconMail />
                </span>
                <input
                  id="email"
                  type="email"
                  className="cms-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="cms-field">
              <div className="cms-label-row">
                <label className="cms-label" htmlFor="password">
                  Password
                </label>
                <a href="#" className="cms-link">
                  Forgot Password?
                </a>
              </div>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="cms-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="cms-input-icon cms-input-icon--right"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <IconEye off={showPassword} />
                </button>
              </div>
            </div>

            <button type="submit" className="cms-btn cms-btn--primary">
              Login to Dashboard
              <IconArrowRight />
            </button>
          </form>

          <div className="cms-divider">
            <span>OR</span>
          </div>

          <button type="button" className="cms-btn cms-btn--outline">
            <IconUserPlus />
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}
