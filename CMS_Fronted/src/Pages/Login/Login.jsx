import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/LoginService";
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

// 🔧 Where each role lands after login — keys must be lowercase to match
// your `user_type` enum values exactly ('admin', 'doctor', 'patient').
const ROLE_ROUTES = {
  admin: "/admin",
  doctor: "/doctor",
  patient: "/patient",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    // Mirrors backend LoginRequest @Pattern/@Size constraints
    const emailRegex = /^[A-Za-z0-9]+[A-Za-z0-9._%+-]*@[A-Za-z0-9-]+\.[A-Za-z]{2,3}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6 || formData.password.length > 20) {
      newErrors.password = "Password length must be 6";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await loginUser(formData);
      // Backend returns LoginResponse -> { message, token, userType }
      const { message, token, userType,id ,name} = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (userType) {
        localStorage.setItem("userType", userType);
      }
      if (id) {
  localStorage.setItem("patientId", id);
}
if (name) {
  localStorage.setItem("patientName", name);
}
      setSuccessMsg(message || "Login successful!");

      // Route to the right dashboard based on the role from the backend
      const normalizedRole = (userType || "").toLowerCase();
      const destination = ROLE_ROUTES[normalizedRole] || "/dashboard";

      setTimeout(() => {
        navigate(destination);
      }, 800);
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object" && !Array.isArray(data)) {
        // 400 from @Valid on LoginRequest: { email: "...", password: "..." }
        setErrors((prev) => ({ ...prev, ...data }));
        setApiError("Please fix the errors below and try again.");
      } else if (typeof data === "string" && data) {
        // Plain-text error from RuntimeException, e.g. "User not found" / "Invalid email or password"
        setApiError(data);
      } else {
        setApiError("Something went wrong while logging in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
            {successMsg && (
              <div className="cms-alert cms-alert--success">{successMsg}</div>
            )}
            {apiError && (
              <div className="cms-alert cms-alert--error">{apiError}</div>
            )}

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
                  name="email"
                  type="email"
                  className="cms-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <span className="cms-error">{errors.email}</span>}
            </div>

            <div className="cms-field">
              <div className="cms-label-row">
                <label className="cms-label" htmlFor="password">
                  Password
                </label>
                <a
                  href="#"
                  className="cms-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="cms-input-wrap">
                <span className="cms-input-icon">
                  <IconLock />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="cms-input"
                  placeholder="Enter your password"
                  value={formData.password}
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
              {errors.password && <span className="cms-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="cms-btn cms-btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login to Dashboard"}
              {!isSubmitting && <IconArrowRight />}
            </button>
          </form>

          <div className="cms-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="cms-btn cms-btn--outline"
            onClick={() => navigate("/register")}
          >
            <IconUserPlus />
            Create New Account
          </button>
         

<p className="cms-doctor-signup-link">
  Registering as a doctor?{" "}
  
   <a href="#"
    className="cms-link"
    onClick={(e) => {
      e.preventDefault();
      navigate("/register?role=doctor");
    }}
  >
    Sign up here
  </a>
</p>

        </div>
      </div>
    </div>
  );
}
         
        
