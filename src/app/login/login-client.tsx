"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // If password is provided, use credentials login
    if (password) {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } else {
      // Otherwise use magic link (email provider)
      signIn("email", { email, callbackUrl: "/dashboard" });
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <a className="auth-logo" href="/">
              <img
                alt="Skool Video Downloader"
                width={32}
                height={32}
                src="/assets/images/img_cb47fedab1.png"
              />
              <span>Skool Video Downloader</span>
            </a>
            <h1>Welcome back</h1>
            <p>Login to your account to continue</p>
          </div>
          <div className="auth-body">
            <button className="auth-google-btn" onClick={handleGoogleLogin}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#F44336" d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"></path><path fill="#FFC107" d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"></path><path fill="#448AFF" d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"></path><path fill="#43A047" d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"></path></svg>
              <span>Continue with Google</span>
            </button>
            <div className="auth-divider">
              <span>or use test accounts</span>
            </div>
            
            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
            
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="password">Password (for test login)</label>
                <input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
                <span>{loading ? "Logging in..." : "Login"}</span>
              </button>
            </form>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#64748b' }}>TEST CREDENTIALS:</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Admin: <strong>admin@test.com</strong></span>
                <span>Pass: <strong>admin123</strong></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>User: <strong>user@test.com</strong></span>
                <span>Pass: <strong>user123</strong></span>
              </div>
            </div>
          </div>
          <div className="auth-footer">
            <p>
              Don't have an account? <a className="auth-link" href="/#signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
