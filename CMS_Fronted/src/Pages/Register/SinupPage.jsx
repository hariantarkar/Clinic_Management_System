import React, { useState } from "react";
import "./SignupPage.css";

// --- Inline icon components (no external icon library needed) ---

const IconUserPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6s6.2 2.3 6.2 5.6" />
    <line x1="18.5" y1="7" x2="18.5" y2="13" />
    <line x1="15.5" y1="10" x2="21.5" y2="10" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 4.5h3.6l1.4 4.3-2.1 1.7a13 13 0 0 0 6.1 6.1l1.7-2.1 4.3 1.4v3.6c0 1-.8 1.8-1.8 1.8C9.9 20.8 3.2 14.1 2.7 6.3c-.1-1 .7-1.8 1.8-1.8Z" />
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

const IconLoginArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9" />
    <polyline points="13 8 17 12 13 16" />
    <line x1="17" y1="12" x2="3" y2="12" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
  </svg>
);

const IconHeartPulse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 20.2 11 19c-4.5-4-7-6.3-7-9.3a4.7 4.7 0 0 1 4.8-4.7c1.6 0 3 .8 3.7 2 .7-1.2 2.1-2 3.7-2A4.7 4.7 0 0 1 21 9.7c0 3-2.5 5.3-7 9.3l-1.5 1.2Z" />
    <polyline points="6 11 8.5 11 10 8.5 12.5 13.5 14 11 18 11" />
  </svg>
);

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your registration logic
    console.log("Create account:", { fullName, email, contact, password });
  };

  return (
    <div className="cms-page">
      <div className="cms-card">
        {/* Left panel */}
        <div className="cms-panel cms-panel--left">
          <div className="cms-icon-badge cms-icon-badge--blue">
            <IconUserPlus />
          </div>

          <h1 className="cms-title">
            Join Clinic Management
            <br />
            System
          </h1>

          <p className="cms-subtext">
            Create your patient account and securely manage appointments,
            prescriptions, and medical history.
          </p>

          <div className="cms-features">
            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--blue cms-icon-badge--sm">
                <IconShield />
              </div>
              <div>
                <div className="cms-feature-title">Secure Patient Records</div>
                <div className="cms-feature-desc">Protected healthcare information.</div>
              </div>
            </div>

            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--green cms-icon-badge--sm">
                <IconHeartPulse />
              </div>
              <div>
                <div className="cms-feature-title">Easy Appointment Booking</div>
                <div className="cms-feature-desc">Manage consultations effortlessly.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="cms-panel cms-panel--right">
          <h2 className="cms-welcome">Create Account</h2>
          <p className="cms-welcome-sub">
            Register to access appointments, prescriptions, and medical records.
          </p>

          <form onSubmit={handleSubmit} className="cms-form">
            <div className="cms-field">
              <label className="cms-label" htmlFor="fullName">
                Full Name
              </label>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconUser />
                </span>
                <input
                  id="fullName"
                  type="text"
                  className="cms-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
              <label className="cms-label" htmlFor="contact">
                Contact Number
              </label>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconPhone />
                </span>
                <input
                  id="contact"
                  type="tel"
                  className="cms-input"
                  placeholder="Enter your contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            <div className="cms-field">
              <label className="cms-label" htmlFor="password">
                Password
              </label>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="cms-input"
                  placeholder="Create password"
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
              <span className="cms-hint">Password must contain at least 6 characters.</span>
            </div>

            <button type="submit" className="cms-btn cms-btn--primary">
              Create Account
              <IconArrowRight />
            </button>
          </form>

          <div className="cms-divider">
            <span>OR</span>
          </div>

          <button type="button" className="cms-btn cms-btn--outline">
            <IconLoginArrow />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
