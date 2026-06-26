import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/ForgotPasswordService";
import "./ResetPasswordPage.css";

// --- Inline icon components (no external icon library needed) ---

const IconUserLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7.5" r="3.2" />
    <path d="M4 19c0-3.4 2.7-5.8 6-5.8 1 0 1.9.2 2.7.6" />
    <rect x="14.3" y="13.5" width="7.2" height="6.2" rx="1.4" />
    <path d="M16 13.5v-1.3a2 2 0 0 1 4 0v1.3" />
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

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="15" r="3.4" />
    <path d="M10.4 12.6 19 4" />
    <path d="M15.4 8 18 5.4" />
    <path d="M17.4 10 20 7.4" />
  </svg>
);

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email + OTP arrive from the Forgot Password page (already format-checked there).
  // Their real validity is confirmed by the backend on submit, below.
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    if (!newPassword) {
      setError("New password is required");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      setError("Password must be between 6 and 20 characters");
      return;
    }
    setError("");

    setIsSubmitting(true);
    try {
      const response = await resetPassword({ email, otp, newPassword });
      // Backend returns ResponseEntity<String> -> "Password updated successfully"
      setSuccessMsg(response.data || "Password updated successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const data = err.response?.data;
      setApiError(
        typeof data === "string" && data
          ? data
          : "Something went wrong while resetting your password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared left panel content for both the form view and the "missing session" view
  const LeftPanel = (
    <div className="cms-panel cms-panel--left">
      <div className="cms-icon-badge cms-icon-badge--blue">
        <IconUserLock />
      </div>

      <h1 className="cms-title">Reset Your Password</h1>

      <p className="cms-subtext">
        Create a new secure password to regain access to your account.
      </p>

      <div className="cms-features">
        <div className="cms-feature">
          <div className="cms-icon-badge cms-icon-badge--blue cms-icon-badge--sm">
            <IconShield />
          </div>
          <div>
            <div className="cms-feature-title">Secure Password Reset</div>
            <div className="cms-feature-desc">Your account security is protected.</div>
          </div>
        </div>

        <div className="cms-feature">
          <div className="cms-icon-badge cms-icon-badge--green cms-icon-badge--sm">
            <IconKey />
          </div>
          <div>
            <div className="cms-feature-title">Quick Recovery</div>
            <div className="cms-feature-desc">Reset your account access instantly.</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Guard: if someone lands here without going through the OTP step, there's
  // nothing to submit against — send them back to request a fresh OTP.
  if (!email || !otp) {
    return (
      <div className="cms-page">
        <div className="cms-card">
          {LeftPanel}
          <div className="cms-panel cms-panel--right">
            <h2 className="cms-welcome">Reset Password</h2>
            <p className="cms-welcome-sub">
              Your password reset session has expired or is invalid.
            </p>
            <div className="cms-alert cms-alert--error">
              Please request a new OTP to reset your password.
            </div>
            <button
              type="button"
              className="cms-btn cms-btn--primary"
              style={{ marginTop: 22 }}
              onClick={() => navigate("/forgot-password")}
            >
              Request New OTP
              <IconArrowRight />
            </button>
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

  return (
    <div className="cms-page">
      <div className="cms-card">
        {LeftPanel}

        {/* Right panel */}
        <div className="cms-panel cms-panel--right">
          <h2 className="cms-welcome">Reset Password</h2>
          <p className="cms-welcome-sub">
            Enter a new secure password to complete your account recovery.
          </p>

          {successMsg && <div className="cms-alert cms-alert--success">{successMsg}</div>}
          {apiError && <div className="cms-alert cms-alert--error">{apiError}</div>}
          {apiError && /otp/i.test(apiError) && (
            <button
              type="button"
              className="cms-link cms-link--button"
              onClick={() => navigate("/forgot-password")}
            >
              Request a new OTP
            </button>
          )}

          <form onSubmit={handleSubmit} className="cms-form">
            <div className="cms-field">
              <label className="cms-label" htmlFor="newPassword">
                New Password
              </label>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconLock />
                </span>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="cms-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleChange}
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
              {error ? (
                <span className="cms-error">{error}</span>
              ) : (
                <span className="cms-hint">Password must contain at least 6 characters.</span>
              )}
            </div>

            <button type="submit" className="cms-btn cms-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
              {!isSubmitting && <IconArrowRight />}
            </button>
          </form>

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
