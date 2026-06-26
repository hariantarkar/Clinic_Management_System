import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/ForgotPasswordService";
import "./ForgotPasswordPage.css";

// --- Inline icon components (no external icon library needed) ---

const IconUserLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7.5" r="3.2" />
    <path d="M4 19c0-3.4 2.7-5.8 6-5.8 1 0 1.9.2 2.7.6" />
    <rect x="14.3" y="13.5" width="7.2" height="6.2" rx="1.4" />
    <path d="M16 13.5v-1.3a2 2 0 0 1 4 0v1.3" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
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

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="3.4" />
    <path d="M10.4 12.6 19 4" />
    <path d="M15.4 8 18 5.4" />
    <path d="M17.4 10 20 7.4" />
  </svg>
);

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[A-Za-z0-9]+[A-Za-z0-9._%+-]*@[A-Za-z0-9-]+\.[A-Za-z]{2,3}$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
    if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
  };

  // Step 1: validate email, ask backend to generate + email an OTP
  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setErrors({ email: "Enter a valid email address" });
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      const response = await forgotPassword(trimmedEmail);
      // Backend returns ResponseEntity<String> -> "OTP sent to registered email"
      setSuccessMsg(response.data || "OTP sent to registered email");
      setOtpSent(true);
    } catch (err) {
      const data = err.response?.data;
      setApiError(
        typeof data === "string" && data
          ? data
          : "Something went wrong while generating the OTP. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: validate OTP format client-side, then hand off to the
  // Reset Password page (actual OTP correctness is verified there,
  // together with the new password, against /auth/reset-password)
  const handleProceedToReset = (e) => {
    e.preventDefault();

    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    if (!/^[0-9]{6}$/.test(trimmedOtp)) {
      setErrors((prev) => ({ ...prev, otp: "Enter the 6-digit OTP sent to your email" }));
      return;
    }

    navigate("/reset-password", {
      state: { email: email.trim(), otp: trimmedOtp },
    });
  };

  return (
    <div className="cms-page">
      <div className="cms-card">
        {/* Left panel */}
        <div className="cms-panel cms-panel--left">
          <div className="cms-icon-badge cms-icon-badge--blue">
            <IconUserLock />
          </div>

          <h1 className="cms-title">Password Recovery</h1>

          <p className="cms-subtext">
            Recover access to your Clinic Management System account securely.
          </p>

          <div className="cms-features">
            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--blue cms-icon-badge--sm">
                <IconShield />
              </div>
              <div>
                <div className="cms-feature-title">Secure Password Recovery</div>
                <div className="cms-feature-desc">Protected account recovery process.</div>
              </div>
            </div>

            <div className="cms-feature">
              <div className="cms-icon-badge cms-icon-badge--green cms-icon-badge--sm">
                <IconKey />
              </div>
              <div>
                <div className="cms-feature-title">Quick Reset Access</div>
                <div className="cms-feature-desc">Generate your OTP instantly.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="cms-panel cms-panel--right">
          <h2 className="cms-welcome">Forgot Password</h2>
          <p className="cms-welcome-sub">
            Enter your registered email address to generate an OTP.
          </p>

          {apiError && <div className="cms-alert cms-alert--error">{apiError}</div>}
          {successMsg && <div className="cms-alert cms-alert--success">{successMsg}</div>}

          <form onSubmit={handleGenerateOtp} className="cms-form">
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
                  onChange={handleEmailChange}
                />
              </div>
              {errors.email && <span className="cms-error">{errors.email}</span>}
            </div>

            <button type="submit" className="cms-btn cms-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? "Generating OTP..." : "Generate OTP"}
              {!isSubmitting && <IconArrowRight />}
            </button>
          </form>

          {otpSent && (
            <form onSubmit={handleProceedToReset} className="cms-otp-box">
              <div className="cms-otp-box-head">
                <div className="cms-icon-badge cms-icon-badge--blue cms-icon-badge--sm">
                  <IconKey />
                </div>
                <div>
                  <div className="cms-otp-box-title">OTP Generated</div>
                  <div className="cms-otp-box-sub">Enter the OTP sent to your email.</div>
                </div>
              </div>

              <div className="cms-field">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="cms-input cms-input--otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
                {errors.otp && <span className="cms-error">{errors.otp}</span>}
              </div>

              <p className="cms-otp-box-hint">
                Copy the OTP from your email and continue to reset your password.
              </p>

              <button type="submit" className="cms-btn cms-btn--primary">
                Reset Password
                <IconArrowRight />
              </button>
            </form>
          )}

          <div className="cms-divider">
            <span>OR</span>
          </div>

          <button type="button" className="cms-btn cms-btn--outline" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
