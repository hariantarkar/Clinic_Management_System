import React, { useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset token for:", email);
  };

  return (
    <div className="fp-container">
      <div className="fp-card">

        {/* LEFT SIDE */}
        <div className="fp-left">
          <div className="fp-icon">👥</div>

          <h2>Password Recovery</h2>
          <p>Recover access to your Clinic Management System account securely.</p>

          <div className="fp-info">
            <div className="fp-item">
              <span>🔒</span>
              <div>
                <h4>Secure Password Recovery</h4>
                <p>Protected account recovery process.</p>
              </div>
            </div>

            <div className="fp-item">
              <span>⚡</span>
              <div>
                <h4>Quick Reset Access</h4>
                <p>Generate your reset token instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="fp-right">
          <h2>Forgot Password</h2>
          <p>Enter your registered email address to generate a reset token.</p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">
              Generate Reset Token →
            </button>

            <div className="divider">OR</div>

            <button type="button" className="secondary">
              Back to Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}