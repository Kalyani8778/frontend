"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type PageStatus = "loading" | "success" | "error";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus]         = useState<PageStatus>("loading");
  const [errorMsg, setErrorMsg]     = useState("");
  const [isExpired, setIsExpired]   = useState(false);

  const [resendEmail, setResendEmail]     = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone]       = useState(false);
  const [resendError, setResendError]     = useState("");

  useEffect(() => {
    async function handleCallback() {
      const token_hash = searchParams.get("token_hash");
      const type       = searchParams.get("type");
      const code       = searchParams.get("code");
      const errorParam = searchParams.get("error");
      const errorDesc  = searchParams.get("error_description");

      if (errorParam) {
        setErrorMsg(errorDesc || errorParam);
        setIsExpired(true); setStatus("error"); return;
      }

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "email" | "signup" | "recovery" | "invite",
        });
        if (error) {
          const msg = error.message.toLowerCase();
          const expired = msg.includes("expired") || msg.includes("invalid") || msg.includes("already used");
          setIsExpired(expired);
          setErrorMsg(expired
            ? "Your verification link has expired or has already been used."
            : `Verification failed: ${error.message}`);
          setStatus("error"); return;
        }
        setStatus("success");
        setTimeout(() => router.replace("/"), 2500); return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setErrorMsg(`Sign-in failed: ${error.message}`); setStatus("error"); return; }
        router.replace("/"); return;
      }

      setErrorMsg("Invalid verification link. Please register again or request a new link.");
      setIsExpired(true); setStatus("error");
    }
    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleResend(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setResendError(""); setResendLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: resendEmail });
    setResendLoading(false);
    if (error) { setResendError(error.message); } else { setResendDone(true); }
  }

  const page: React.CSSProperties = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(145deg, #0f0f1a 0%, #1a1040 55%, #0d1b2a 100%)",
    fontFamily: "var(--font-body, 'Manrope', sans-serif)", padding: "24px",
  };
  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 16, padding: "44px 40px",
    textAlign: "center", maxWidth: 420, width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  };
  const titleStyle: React.CSSProperties = {
    fontSize: 22, fontWeight: 700, color: "#0f172a",
    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)", margin: "0 0 10px",
  };
  const bodyStyle: React.CSSProperties = { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" };

  if (status === "success") {
    return (
      <div style={page}>
        <style>{`@keyframes progress{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
        <div style={card}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6 L9 17 L4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={titleStyle}>Email verified!</h2>
          <p style={bodyStyle}>Your account is now active. Redirecting you to the dashboard…</p>
          <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", animation: "progress 2.5s linear forwards" }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div style={page}>
        <div style={card}>
          <div style={{ width: 48, height: 48, border: "4px solid #e2e8f0", borderTop: "4px solid #6366f1", borderRadius: "50%", margin: "0 auto 28px", animation: "spin 0.8s linear infinite" }} />
          <h2 style={titleStyle}>Verifying your account…</h2>
          <p style={bodyStyle}>Please wait while we confirm your identity.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ marginBottom: 18 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#ef4444"/>
          </svg>
        </div>
        <h2 style={titleStyle}>{isExpired ? "Link expired" : "Verification failed"}</h2>
        <p style={bodyStyle}>{errorMsg}</p>

        {isExpired && (
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px", marginBottom: 22, textAlign: "left" }}>
            {resendDone ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M20 6 L9 17 L4 12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                New verification email sent! Check your inbox.
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 10px", fontWeight: 600 }}>Enter your email to receive a new verification link:</p>
                <form onSubmit={handleResend} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input type="email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="agent@company.com" required
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }} />
                  {resendError && <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>{resendError}</p>}
                  <button type="submit" disabled={resendLoading}
                    style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: resendLoading ? 0.7 : 1 }}>
                    {resendLoading ? "Sending…" : "Resend verification email"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
          <a href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <a href="/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Register again</a>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackInner />
    </Suspense>
  );
}
