import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Left panel slides data ──────────────────────────────── */
const SLIDES = [
  {
    visual: 'upi-flow',
    title: 'UPI wallets for employees',
    desc: 'Add your team on CashBook and issue digital UPI wallets for all business expenses.',
  },
  {
    visual: 'qr-scan',
    title: 'Spend via UPI & track every expense',
    desc: 'Scan & pay any UPI QR. You get real-time visibility and control, eliminating manual work.',
  },
  {
    visual: 'reports',
    title: 'Instant expense reports',
    desc: 'Download detailed reports with receipts. No more chasing bills at month end.',
  },
  {
    visual: 'limits',
    title: 'Set spending limits & controls',
    desc: 'Control how much each employee spends, pause wallets anytime from your dashboard.',
  },
];

/* ── UPI flow diagram for slide 1 ─────────────────────── */
function UpiFlowSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '10px 0' }}>
      {/* Current Account */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#DBEAFE', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="10" width="18" height="11" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none" />
            <path d="M3 13h18M7 7l5-4 5 4" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Current Account</div>
      </div>

      <div style={{ width: 2, height: 18, borderLeft: '2px dashed #93C5FD' }} />

      {/* Virtual Account */}
      <div style={{ border: '1.5px dashed #93C5FD', borderRadius: 8, padding: '8px 16px', background: 'white', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="13" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none" />
            <path d="M2 11h20" stroke="#2563EB" strokeWidth="1.8" />
          </svg>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF' }}>Virtual Account</span>
      </div>

      {/* 3-way split */}
      <div style={{ position: 'relative', width: 240, height: 36 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: 16, borderLeft: '2px dashed #93C5FD', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: '14%', right: '14%', top: 16, height: 2, borderTop: '2px dashed #93C5FD' }} />
        {[14, 50, 86].map((pct) => (
          <div key={pct} style={{ position: 'absolute', left: `${pct}%`, top: 16, width: 2, height: 20, borderLeft: '2px dashed #93C5FD', transform: 'translateX(-50%)' }} />
        ))}
      </div>

      {/* 3 Wallet boxes */}
      <div style={{ display: 'flex', gap: 12 }}>
        {['Employee\nUPI Wallet', 'Employee\nUPI Wallet', 'Employee\nUPI Wallet'].map((label, i) => (
          <div key={i} style={{ border: '1.5px solid #BFDBFE', borderRadius: 8, padding: '8px', background: '#EFF6FF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 68 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="14" rx="2" stroke="#2563EB" strokeWidth="1.8" fill="none" />
                <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#2563EB" />
                <path d="M2 10h20" stroke="#2563EB" strokeWidth="1.8" />
              </svg>
            </div>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#1D4ED8', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{label}</div>
            <div style={{ fontSize: 7, fontWeight: 800, color: '#F97316' }}>NPCI▶</div>
          </div>
        ))}
      </div>

      {/* QR scanners */}
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 68 }}>
            <div style={{ width: 2, height: 12, borderLeft: '2px dashed #93C5FD' }} />
            <div style={{ width: 32, height: 32, borderRadius: 6, background: '#F1F5F9', border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#475569" strokeWidth="1.5" fill="none" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#475569" strokeWidth="1.5" fill="none" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#475569" strokeWidth="1.5" fill="none" />
                <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M14 21h2" stroke="#475569" strokeWidth="1.2" />
              </svg>
              <div style={{ position: 'absolute', bottom: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', border: '1.5px solid white' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── QR scan slide visual ─────────────────────────────── */
function QrScanSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 10, fontWeight: 500 }}>Paying from: Your Wallet</div>
      <div style={{
        width: 140, height: 140, borderRadius: 12,
        background: 'white', border: '2px solid #E5E7EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: 12,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* QR code simulation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,12px)', gap: 1.5 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const r = Math.floor(i / 10), c = i % 10;
            const isCorner = (r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3);
            const isBorder = isCorner && (r === 0 || r === 2 || c === 0 || c === 2 || (r > 6 && (r === 7 || r === 9 || c === 0 || c === 2)));
            const dark = isCorner || (Math.random() > 0.5 && !isCorner);
            return (
              <div key={i} style={{
                width: 12, height: 12,
                background: dark ? '#111827' : '#F9FAFB',
                borderRadius: 2,
              }} />
            );
          })}
        </div>
        {/* Scanning line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '40%',
          height: 2, background: 'linear-gradient(to right, transparent, #22C55E, transparent)',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {['Scan from gallery', '🎤'].map((label) => (
          <div key={label} style={{
            padding: '6px 12px', borderRadius: 20,
            background: '#2563EB', color: 'white',
            fontSize: 10, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {label === '🎤' ? label : <><span>🖼️</span> {label}</>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Toast notification ───────────────────────────────── */
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3500);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: '#1F2937', color: 'white',
      padding: '12px 20px', borderRadius: 30,
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 13, fontWeight: 500, zIndex: 999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      animation: 'slideUp 300ms ease',
    }}>
      <span style={{ color: '#22C55E', fontSize: 16 }}>✓</span>
      {message}
    </div>
  );
}

/* ── Main Login Page ──────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [slide, setSlide] = useState(0);
  const [step, setStep] = useState('input'); // input | otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState('');
  const otpRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/onboarding', { replace: true });
  }, [isAuthenticated, navigate]);

  // Auto-advance slides
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleSendOtp = async () => {
    setError('');
    if (!email.trim()) { setError('Email address enter karo'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error('Server se connect nahi ho paya. Backend start karo.'); }
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setStep('otp');
      setTimer(30);
      setDevOtp(data._demo_otp || '');
      setToast(data._demo_otp ? 'OTP generated (dev mode)' : `OTP sent to ${email}`);
      setTimeout(() => otpRef.current?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length < 6) { setError('6-digit OTP enter karo'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error('Server se connect nahi ho paya. Backend start karo.'); }
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      login(data.user);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp('');
    setError('');
    await handleSendOtp();
  };

  const currentSlide = SLIDES[slide];
  const canSend = email.trim().length >= 6;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '35%', minWidth: 300,
        background: 'linear-gradient(160deg, #EEF2FF 0%, #E0E7FF 50%, #EDE9FE 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>C</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#1E3A8A' }}>CASHBOOK</span>
        </div>

        {/* Slide visual */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          {slide === 0 ? <UpiFlowSlide /> : <QrScanSlide />}
        </div>

        {/* Slide text */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E3A8A', marginBottom: 8 }}>
            {currentSlide.title}
          </h3>
          <p style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.6, marginBottom: 16 }}>
            {currentSlide.desc}
          </p>

          {/* Dots + arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSlide(i)}
                  style={{
                    width: i === slide ? 18 : 7, height: 7,
                    borderRadius: 4, cursor: 'pointer',
                    background: i === slide ? '#2563EB' : '#BFDBFE',
                    transition: 'all 300ms',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'white', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12,
              }}
            >›</button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: 'white', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
              Welcome to CashBook 👋
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>Login/Register to CashBook</p>
          </div>

          {/* Form card */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px', background: 'white' }}>
            {step === 'input' ? (
              <>
                {/* Email input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
                    Enter your email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && canSend) handleSendOtp(); }}
                    placeholder="xyz123@gmail.com"
                    autoFocus
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: `1.5px solid ${email.trim() ? '#2563EB' : '#D1D5DB'}`,
                      borderRadius: 8, fontSize: 14, outline: 'none',
                      boxSizing: 'border-box', transition: 'border-color 150ms',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = email.trim() ? '#2563EB' : '#D1D5DB'}
                  />
                </div>

                {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</p>}

                {/* Send OTP button */}
                <button
                  onClick={handleSendOtp}
                  disabled={!canSend || loading}
                  style={{
                    width: '100%', padding: '12px',
                    background: canSend && !loading ? '#3D52D5' : '#D1D5DB',
                    color: canSend && !loading ? 'white' : '#9CA3AF',
                    border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 700,
                    cursor: canSend && !loading ? 'pointer' : 'not-allowed',
                    transition: 'background 200ms',
                  }}
                >
                  {loading ? 'Sending…' : 'Send OTP'}
                </button>
              </>
            ) : (
              /* OTP Entry step */
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <button
                    onClick={() => { setStep('input'); setOtp(''); setError(''); setDevOtp(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#374151', padding: 0 }}
                  >←</button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Enter OTP</span>
                </div>

                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: devOtp ? 10 : 16 }}>
                  Please enter the 6-digit OTP sent to{' '}
                  <strong style={{ color: '#111827' }}>{email}</strong>
                </p>

                {/* Dev mode OTP box */}
                {devOtp && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', marginBottom: 14,
                    background: '#FFF7ED', border: '1.5px dashed #F97316',
                    borderRadius: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#9A3412', fontWeight: 600, marginBottom: 2 }}>
                        DEV MODE — Email not sent
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#EA580C', letterSpacing: 4 }}>
                        {devOtp}
                      </div>
                    </div>
                    <button
                      onClick={() => { setOtp(devOtp); setTimeout(() => otpRef.current?.focus(), 50); }}
                      style={{
                        padding: '6px 12px', borderRadius: 6,
                        border: '1px solid #F97316', background: '#FFF',
                        color: '#EA580C', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Use this
                    </button>
                  </div>
                )}

                {/* OTP single input */}
                <input
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && otp.length === 6) handleVerifyOtp(); }}
                  placeholder="e.g. 123456"
                  maxLength={6}
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1.5px solid ${error ? '#EF4444' : '#2563EB'}`,
                    borderRadius: 8, fontSize: 18, fontWeight: 700,
                    outline: 'none', letterSpacing: 6, marginBottom: 12,
                    boxSizing: 'border-box', textAlign: 'center',
                  }}
                />

                {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</p>}

                {/* Verify button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6 || loading}
                  style={{
                    width: '100%', padding: '12px',
                    background: otp.length === 6 && !loading ? '#3D52D5' : '#D1D5DB',
                    color: otp.length === 6 && !loading ? 'white' : '#9CA3AF',
                    border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 700,
                    cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                    marginBottom: 12, transition: 'background 200ms',
                  }}
                >
                  {loading ? 'Verifying…' : 'Verify'}
                </button>

                {/* Terms */}
                <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6, marginBottom: 12 }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#2563EB', cursor: 'pointer' }}>Terms</span> and{' '}
                  <span style={{ color: '#2563EB', cursor: 'pointer' }}>Policies</span>
                </p>

                {/* Resend */}
                <div style={{ textAlign: 'center' }}>
                  {timer > 0 ? (
                    <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 500 }}>
                      Resend OTP in{' '}
                      <strong>00:{String(timer).padStart(2, '0')}</strong>
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Terms (input step) */}
          {step === 'input' && (
            <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 16, lineHeight: 1.6, padding: '0 10px' }}>
              By clicking send OTP, you are indicating that you accept our{' '}
              <span style={{ color: '#2563EB', cursor: 'pointer' }}>Terms of Service</span> and{' '}
              <span style={{ color: '#2563EB', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>
          )}

          {/* Footer link */}
          <p style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 28 }}>
            To know more about CashBook please visit{' '}
            <span style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>
              cashbook.in ↗
            </span>
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onHide={() => setToast('')} />}
    </div>
  );
}
