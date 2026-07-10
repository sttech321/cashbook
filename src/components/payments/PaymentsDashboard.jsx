import { useState, useRef, useEffect } from 'react';
import { Play, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/* ── Dashed connector line ─────────────────────────────── */
function DashedLine({ length = 40 }) {
  return (
    <div style={{
      width: 2, height: length,
      borderLeft: '2px dashed #93C5FD',
      margin: '0 auto',
    }} />
  );
}

/* ── Flow nodes ────────────────────────────────────────── */
function AdminNode() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="white" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <span style={{ fontSize: 12, color: '#374151', fontWeight: 600, marginTop: 6 }}>Primary Admin</span>
    </div>
  );
}

function VirtualAccountNode() {
  return (
    <div style={{
      border: '1.5px dashed #93C5FD', borderRadius: 10,
      padding: '10px 20px', background: 'white',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 2px 8px rgba(37,99,235,0.08)', minWidth: 160,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none" />
          <path d="M2 11h20" stroke="#2563EB" strokeWidth="1.8" />
          <path d="M6 3l6-1 6 1" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF' }}>Virtual Account</span>
    </div>
  );
}

function WalletNode({ label }) {
  return (
    <div style={{
      border: '1.5px solid #BFDBFE', borderRadius: 8,
      padding: '8px 10px', background: '#EFF6FF',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80,
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none" />
          <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#2563EB" />
          <path d="M2 10h20" stroke="#2563EB" strokeWidth="1.8" />
        </svg>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: '#1D4ED8', textAlign: 'center', lineHeight: 1.3 }}>
        {label}<br /><span style={{ fontWeight: 400, color: '#60A5FA' }}>Wallet</span>
      </span>
    </div>
  );
}

function CardNode() {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 8,
      background: '#F1F5F9', border: '1.5px solid #CBD5E1',
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#475569" strokeWidth="1.8" fill="none" />
        <path d="M2 9h20" stroke="#475569" strokeWidth="1.8" />
        <rect x="4" y="13" width="6" height="2" rx="1" fill="#475569" />
      </svg>
      <div style={{
        position: 'absolute', bottom: -3, right: -3,
        width: 12, height: 12, borderRadius: '50%',
        background: '#F59E0B', border: '1.5px solid white',
      }} />
    </div>
  );
}

/* ── Mobile Verification step ──────────────────────────── */
function MobileVerification({ onBack, onSendOtp }) {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: user.mobile }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'OTP send karne mein problem'); return; }
      onSendOtp();
    } catch {
      setError('Server se connect nahi ho pa raha. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 24px', minHeight: 'calc(100vh - 120px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #E5E7EB', borderRadius: 12,
        background: 'white', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', textAlign: 'center', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <button
              onClick={onBack}
              style={{
                position: 'absolute', left: 32,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#374151', display: 'flex', alignItems: 'center',
                fontSize: 18, padding: 0,
              }}
            >
              ←
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Mobile Number Verification</h2>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>For CashBook UPI Activation</p>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 40px 36px' }}>
          <div style={{
            border: '1px solid #E5E7EB', borderRadius: 10,
            padding: '24px 20px', textAlign: 'center',
          }}>
            {/* Mobile number box */}
            <div style={{
              background: '#EEF2FF', borderRadius: 8,
              padding: '16px 20px', marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: 500 }}>
                Registered Mobile Number
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', letterSpacing: 0.5 }}>
                {user.mobile}
              </div>
            </div>

            {/* Info text */}
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 20, lineHeight: 1.6 }}>
              We will send <strong>One Time Password</strong> on your<br />
              CashBook registered mobile number
            </p>

            {error && (
              <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12, background: '#FEF2F2', padding: '10px 14px', borderRadius: 8, border: '1px solid #FECACA' }}>
                {error}
              </p>
            )}

            {/* Send OTP button */}
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#9CA3AF' : '#3D52D5', color: 'white',
                border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 0.3,
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#2563EB'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#3D52D5'; }}
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── OTP Entry step ────────────────────────────────────── */
function OtpVerification({ onBack, onVerify }) {
  const { user } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setOtp(pasted.split('').concat(Array(6).fill('')).slice(0, 6));
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit OTP'); return; }
    setVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: user.mobile, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'OTP galat hai'); setVerifying(false); return; }
      onVerify();
    } catch {
      setError('Server se connect nahi ho pa raha. Dobara try karein.');
      setVerifying(false);
    }
  };

  const filled = otp.every((d) => d !== '');

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 24px', minHeight: 'calc(100vh - 120px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #E5E7EB', borderRadius: 12,
        background: 'white', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', textAlign: 'center', borderBottom: '1px solid #F3F4F6', position: 'relative' }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#374151', display: 'flex', alignItems: 'center', fontSize: 18, padding: 0,
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Enter OTP</h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>For CashBook UPI Activation</p>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 40px 36px' }}>
          <div style={{
            border: '1px solid #E5E7EB', borderRadius: 10,
            padding: '28px 24px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 20, lineHeight: 1.6 }}>
              OTP sent to <strong>{user.mobile}</strong>
            </p>

            {/* 6-digit OTP boxes */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  style={{
                    width: 48, height: 52,
                    textAlign: 'center', fontSize: 20, fontWeight: 700,
                    border: error ? '2px solid #EF4444' : digit ? '2px solid #2563EB' : '1.5px solid #D1D5DB',
                    borderRadius: 8, outline: 'none',
                    background: digit ? '#EFF6FF' : 'white',
                    color: '#111827',
                    transition: 'border-color 150ms',
                  }}
                />
              ))}
            </div>

            {error && (
              <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{error}</p>
            )}

            {/* Resend timer */}
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>
              {timer > 0
                ? <>Resend OTP in <strong style={{ color: '#374151' }}>00:{String(timer).padStart(2, '0')}</strong></>
                : <span
                    style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
                    onClick={async () => {
                      setTimer(30);
                      setError('');
                      try {
                        await fetch('/api/auth/send-otp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ mobile: user.mobile }),
                        });
                      } catch { /* silent — timer already reset */ }
                    }}
                  >Resend OTP</span>
              }
            </p>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={!filled || verifying}
              style={{
                width: '100%', padding: '13px',
                background: filled && !verifying ? '#3D52D5' : '#9CA3AF',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 700,
                cursor: filled && !verifying ? 'pointer' : 'not-allowed',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => { if (filled && !verifying) e.currentTarget.style.background = '#2563EB'; }}
              onMouseLeave={(e) => { if (filled && !verifying) e.currentTarget.style.background = '#3D52D5'; }}
            >
              {verifying ? 'Verifying…' : 'Verify OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Activation Success step ───────────────────────────── */
function ActivationSuccess({ onDone }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 560,
        border: '1px solid #E5E7EB', borderRadius: 12,
        background: 'white', padding: '48px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#DCFCE7', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Activation Initiated!</h2>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 1.6 }}>
          Your CashBook UPI activation request has been submitted.<br />
          Our team will verify and activate your account within 24 hours.
        </p>
        <button
          onClick={onDone}
          style={{
            padding: '12px 32px', background: '#3D52D5', color: 'white',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ── Main Dashboard ────────────────────────────────────── */
export default function PaymentsDashboard() {
  const { currentBusiness } = useApp();
  const [step, setStep] = useState('dashboard'); // dashboard | verify | otp | success

  /* ── Verification / OTP screens ── */
  if (step === 'verify') {
    return (
      <div style={{ background: 'white', minHeight: '100%' }}>
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #E5E7EB' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16 }}>
            Payments
            <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 4 }}>
              ({currentBusiness?.name})
            </span>
          </h1>
        </div>
        <MobileVerification onBack={() => setStep('dashboard')} onSendOtp={() => setStep('otp')} />
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div style={{ background: 'white', minHeight: '100%' }}>
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #E5E7EB' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16 }}>
            Payments
            <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 4 }}>
              ({currentBusiness?.name})
            </span>
          </h1>
        </div>
        <OtpVerification onBack={() => setStep('verify')} onVerify={() => setStep('success')} />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ background: 'white', minHeight: '100%' }}>
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #E5E7EB' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16 }}>
            Payments
            <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 4 }}>
              ({currentBusiness?.name})
            </span>
          </h1>
        </div>
        <ActivationSuccess onDone={() => setStep('dashboard')} />
      </div>
    );
  }

  /* ── Main dashboard view ── */
  return (
    <div style={{ padding: '20px 24px', background: 'white', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{ paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          Payments
          <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 4 }}>
            ({currentBusiness?.name})
          </span>
        </h1>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 1100 }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
          <div style={{ padding: '28px 32px' }}>
            {/* Heading */}
            <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 24, color: '#111827' }}>
              Manage Business Expenses with{' '}
              <span style={{ color: '#0D9488' }}>CashBook UPI</span>
              {' '}🔥
            </h2>

            {/* Phone + features */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
              {/* Phone mockup */}
              <div style={{
                width: 110, flexShrink: 0,
                background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
                borderRadius: 12, padding: '14px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 130,
              }}>
                <div>
                  <div style={{
                    width: 70, height: 110, background: '#1E293B', borderRadius: 12,
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  }}>
                    <div style={{
                      flex: 1, background: 'white', margin: '6px 4px 4px',
                      borderRadius: 8, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', padding: 4,
                    }}>
                      <div style={{ fontSize: 7, fontWeight: 800, color: '#2563EB', letterSpacing: 1, marginBottom: 4 }}>UPI</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,6px)', gap: 1, marginBottom: 4 }}>
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: 1,
                            background: [0,1,5,6,10,14,15,16,17,18,19,20,24,3,4,9,8,23,22].includes(i) ? '#1E293B' : '#F3F4F6',
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 6, color: '#6B7280', fontWeight: 600 }}>Scan & Pay</div>
                    </div>
                    <div style={{ height: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 3 }}>
                      <div style={{ width: 24, height: 2, background: '#475569', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ width: 50, height: 8, background: '#374151', margin: '0 auto', borderRadius: '0 0 6px 6px' }} />
                </div>
              </div>

              {/* Features */}
              <div style={{ flex: 1 }}>
                {[
                  { bg: '#DBEAFE', text: 'Recharge Employee Wallets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none"/><path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#2563EB"/><path d="M2 10h20" stroke="#2563EB" strokeWidth="1.8"/><path d="M12 3v3M10 4l2-1 2 1" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { bg: '#DCFCE7', text: 'Get notified of every expense', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                  { bg: '#CCFBF1', text: 'Set limits on wallets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0D9488" strokeWidth="1.8" fill="none"/><path d="M12 8v4l3 3" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                ].map(({ bg, text, icon }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
                UPI Wallets at{' '}
                <span style={{ textDecoration: 'line-through', color: '#9CA3AF' }}>₹4,780.00</span>
                {' '}<strong style={{ color: '#111827' }}>₹3,499.00</strong>
                {' '}<span style={{ color: '#6B7280' }}>per wallet per year plus GST.</span>
              </p>
              <p style={{ fontSize: 13, color: '#0D9488', fontWeight: 500 }}>
                Bulk Buying Offer: Buy in bulk to save up to 47%.
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 18px', border: '1.5px solid #D1D5DB',
                borderRadius: 8, background: 'white',
                fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <Play size={13} fill="#374151" />
                Watch 1-min Video
              </button>
              <button
                onClick={() => setStep('verify')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 22px', background: '#3D52D5', color: 'white',
                  border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 2px 8px rgba(61,82,213,0.3)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3D52D5'}
              >
                Activate Payments
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Note */}
            <p style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              You can enable CashBook UPI in only 1 business
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, background: 'white', padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, textAlign: 'center', marginBottom: 28, color: '#111827' }}>
            How does CashBook UPI work?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <AdminNode />
            <DashedLine length={28} />
            <VirtualAccountNode />

            {/* Three-way split */}
            <div style={{ position: 'relative', width: 260, height: 40 }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: 20, borderLeft: '2px dashed #93C5FD', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', left: '15%', right: '15%', top: 20, height: 2, borderTop: '2px dashed #93C5FD' }} />
              <div style={{ position: 'absolute', left: '15%', top: 20, width: 2, height: 20, borderLeft: '2px dashed #93C5FD' }} />
              <div style={{ position: 'absolute', left: '50%', top: 20, width: 2, height: 20, borderLeft: '2px dashed #93C5FD', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', right: '15%', top: 20, width: 2, height: 20, borderLeft: '2px dashed #93C5FD' }} />
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center' }}>
              {['Employee A', 'Employee B', 'Employee C'].map((name) => (
                <WalletNode key={name} label={name} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 0 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                  <DashedLine length={22} />
                  <CardNode />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8, fontWeight: 500 }}>Powered By:</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {[
                  { label: 'UPI', color: '#F97316', bg: '#FFF7ED' },
                  { label: 'NPCI', color: '#2563EB', bg: '#EFF6FF' },
                  { label: 'OBOPAY', color: '#7C3AED', bg: '#F5F3FF' },
                ].map(({ label, color, bg }) => (
                  <div key={label} style={{ padding: '4px 12px', background: bg, border: `1px solid ${color}30`, borderRadius: 6, fontSize: 11, fontWeight: 800, color, letterSpacing: 0.5 }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
