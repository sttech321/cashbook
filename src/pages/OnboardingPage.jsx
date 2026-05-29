import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/* ─── Category data with SVG icons ─────────────────────────── */
const CATEGORIES = [
  { key: 'Agriculture',         icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><path d="M20 8c-6.627 0-12 5.373-12 12 0 3.31 1.344 6.31 3.515 8.485L20 32l8.485-3.515A11.963 11.963 0 0032 20c0-6.627-5.373-12-12-12z" fill="#10B981"/><path d="M14 22c2-4 6-6 6-6s0 4-2 6-4 2-4 0z" fill="#059669"/><path d="M26 22c-2-4-6-6-6-6s0 4 2 6 4 2 4 0z" fill="#059669"/><path d="M20 16v10" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: 'Construction',        icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><rect x="10" y="24" width="20" height="8" rx="1" fill="#10B981"/><polygon points="20,8 10,24 30,24" fill="#059669"/><rect x="16" y="24" width="8" height="8" fill="#065F46"/></svg> },
  { key: 'Education',           icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><path d="M20 10L8 16l12 6 12-6-12-6z" fill="#2563EB"/><path d="M14 19v7c0 0 2 3 6 3s6-3 6-3v-7" fill="#3B82F6"/><rect x="28" y="16" width="2" height="10" rx="1" fill="#1D4ED8"/></svg> },
  { key: 'Electronics',         icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#EDE9FE"/><rect x="8" y="14" width="24" height="16" rx="2" fill="#7C3AED"/><rect x="14" y="10" width="12" height="4" rx="1" fill="#8B5CF6"/><path d="M16 22h8M20 19v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: 'Financial Services',  icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><circle cx="20" cy="20" r="10" fill="#10B981"/><path d="M20 13v14M16 16h6a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: 'Food/Restaurant',     icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#FEF3C7"/><path d="M16 10v8a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-8" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/><path d="M20 22v8" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 10v4c0 3 2 5 4 6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: 'Clothes/Fashion',     icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#FCE7F3"/><path d="M14 10h12l4 8H26v12H14V18H10l4-8z" fill="#EC4899"/><path d="M17 10c0 1.657 1.343 3 3 3s3-1.343 3-3" stroke="white" strokeWidth="1.5" fill="none"/></svg> },
  { key: 'Hardware',            icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#FEE2E2"/><rect x="18" y="8" width="4" height="20" rx="2" fill="#EF4444"/><rect x="8" y="24" width="24" height="4" rx="2" fill="#DC2626"/><circle cx="20" cy="8" r="3" fill="#B91C1C"/></svg> },
  { key: 'Jewellery',           icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#EDE9FE"/><path d="M12 14l8 4 8-4-8-4-8 4z" fill="#7C3AED"/><path d="M12 14l8 16 8-16" fill="#8B5CF6" fillOpacity=".7"/></svg> },
  { key: 'Healthcare & Fitness',icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><path d="M16 20h8M20 16v8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/><rect x="10" y="10" width="20" height="20" rx="4" stroke="#059669" strokeWidth="1.5" fill="none"/></svg> },
  { key: 'Kirana/Grocery',      icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><path d="M10 14h20l-2 14H12L10 14z" fill="#10B981"/><path d="M14 14c0-3.314 1.343-6 3-6h6c1.657 0 3 2.686 3 6" stroke="#059669" strokeWidth="1.5" fill="none"/><circle cx="16" cy="25" r="1.5" fill="white"/><circle cx="24" cy="25" r="1.5" fill="white"/></svg> },
  { key: 'Transport',           icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><rect x="6" y="18" width="28" height="12" rx="3" fill="#2563EB"/><path d="M6 22h28" stroke="#1D4ED8" strokeWidth="1"/><path d="M20 18V12h8l4 6" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="12" cy="30" r="3" fill="#1D4ED8"/><circle cx="28" cy="30" r="3" fill="#1D4ED8"/></svg> },
  { key: 'Other',               icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><rect x="10" y="10" width="8" height="8" rx="2" fill="#2563EB"/><rect x="22" y="10" width="8" height="8" rx="2" fill="#3B82F6"/><rect x="10" y="22" width="8" height="8" rx="2" fill="#3B82F6"/><rect x="22" y="22" width="8" height="8" rx="2" fill="#2563EB"/></svg> },
];

const BUSINESS_TYPES = [
  { key: 'Retailer',         icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><rect x="8" y="18" width="24" height="14" rx="2" fill="#2563EB"/><path d="M12 18V14a8 8 0 0 1 16 0v4" stroke="#1D4ED8" strokeWidth="1.5" fill="none"/><path d="M16 26h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: 'Distributor',      icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><rect x="6" y="20" width="28" height="10" rx="2" fill="#2563EB"/><path d="M20 20V12l8 8" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle cx="12" cy="30" r="2.5" fill="#1D4ED8"/><circle cx="28" cy="30" r="2.5" fill="#1D4ED8"/></svg> },
  { key: 'Manufacturer',     icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><rect x="10" y="22" width="20" height="10" rx="2" fill="#10B981"/><path d="M10 22l5-12h10l5 12" fill="#059669"/><rect x="17" y="14" width="6" height="8" fill="#065F46"/></svg> },
  { key: 'Service Provider', icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><circle cx="20" cy="16" r="6" fill="#2563EB"/><path d="M10 32c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M16 26l2 4 6-6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'Trader',           icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#D1FAE5"/><rect x="10" y="12" width="20" height="16" rx="2" fill="#10B981"/><path d="M15 20l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 18h20" stroke="#059669" strokeWidth="1"/></svg> },
  { key: 'Other',            icon: <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#DBEAFE"/><rect x="10" y="10" width="8" height="8" rx="2" fill="#2563EB"/><rect x="22" y="10" width="8" height="8" rx="2" fill="#3B82F6"/><rect x="10" y="22" width="8" height="8" rx="2" fill="#3B82F6"/><rect x="22" y="22" width="8" height="8" rx="2" fill="#2563EB"/></svg> },
];

/* ─── Category / Type card ──────────────────────────────────── */
function SelectCard({ icon, label, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderRadius: 8, cursor: 'pointer',
        border: `1.5px solid ${selected ? '#2563EB' : hover ? '#93C5FD' : '#E5E7EB'}`,
        background: selected ? '#EFF6FF' : hover ? '#F8FAFF' : 'white',
        position: 'relative', transition: 'all 0.12s',
      }}
    >
      {icon}
      <span style={{ fontSize: 14, fontWeight: 500, color: selected ? '#1D4ED8' : '#111827' }}>{label}</span>
      {selected && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 16, height: 16, borderRadius: '50%', background: '#2563EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Main Onboarding Page ──────────────────────────────────── */
export default function OnboardingPage() {
  const { businesses, addBusiness, loadingBiz, currentBusinessId } = useApp();
  const { updateUser, token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(null); // null=loading, 'done', 'details', 'category', 'type'
  const [fullName, setFullName] = useState('');
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('');
  const [bizType, setBizType] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // After AppContext loads, decide which step to show
  useEffect(() => {
    if (loadingBiz) return;
    if (businesses.length > 0) {
      setStep('done');
    } else {
      setStep('details');
    }
  }, [loadingBiz, businesses.length]);

  const goToDashboard = () => {
    const bizId = currentBusinessId || businesses[0]?.id;
    if (bizId) navigate(`/businesses/${bizId}/cashbooks`, { replace: true });
  };

  const handleGetStarted = () => {
    setError('');
    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (!bizName.trim()) { setError('Please enter your business name'); return; }
    setStep('category');
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStep('type');
  };

  const handleCategorySkip = () => {
    setCategory('');
    setStep('type');
  };

  const handleFinish = async (skipType = false) => {
    if (saving) return;
    setSaving(true);
    try {
      // Save full name to user profile
      if (fullName.trim()) {
        updateUser({ name: fullName.trim() });
        fetch('/api/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: fullName.trim() }),
        }).catch(() => {});
      }

      const bizId = await addBusiness({
        name: bizName.trim(),
        category: category || null,
        businessType: skipType ? null : (bizType || null),
      });
      navigate(`/businesses/${bizId}/cashbooks`, { replace: true });
    } catch (err) {
      setError('Failed to create business: ' + err.message);
      setSaving(false);
    }
  };

  // Loading
  if (step === null || loadingBiz) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 36, height: 36, border: '3px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 13, color: '#6B7280' }}>Loading…</span>
      </div>
    );
  }

  /* ── Shared header ── */
  const Header = ({ showBack, onBack }) => (
    <div style={{ height: 56, borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', padding: '0 24px', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 5, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>C</div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#1E3A8A' }}>CASHBOOK</span>
      </div>
    </div>
  );

  /* ── Already done ── */
  if (step === 'done') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '32px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', minWidth: 340 }}>
            <CheckCircle size={40} color="#16A34A" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
              You cashbook profile is already completed
            </div>
            <button
              onClick={goToDashboard}
              style={{
                width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                background: '#2563EB', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Visit Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 1: Name + Business ── */
  if (step === 'details') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '36px 40px', width: '100%', maxWidth: 460, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Welcome to CashBook</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>Please fill the below details</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Your Full Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                autoFocus
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                placeholder="Your Full Name"
                onKeyDown={(e) => { if (e.key === 'Enter') handleGetStarted(); }}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Business Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                value={bizName}
                onChange={(e) => { setBizName(e.target.value); setError(''); }}
                placeholder="Business Name"
                onKeyDown={(e) => { if (e.key === 'Enter') handleGetStarted(); }}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleGetStarted}
                disabled={!fullName.trim() || !bizName.trim()}
                style={{
                  padding: '11px 32px', borderRadius: 8, border: 'none',
                  background: fullName.trim() && bizName.trim() ? '#2563EB' : '#D1D5DB',
                  color: fullName.trim() && bizName.trim() ? 'white' : '#9CA3AF',
                  fontSize: 14, fontWeight: 700,
                  cursor: fullName.trim() && bizName.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2: Business Category ── */
  if (step === 'category') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
        <Header />
        <div style={{ flex: 1, padding: '32px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setStep('details')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} color="#374151" />
              </button>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Select Business Category
                  {bizName && <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>({bizName})</span>}
                </h2>
                <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>This will help us personalize your app experience</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Business Setup:</span>
              <span style={{ padding: '4px 12px', borderRadius: 20, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 12, fontWeight: 700, color: '#374151' }}>Step 1/2</span>
            </div>
          </div>

          {/* Category grid */}
          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {CATEGORIES.map(({ key, icon }) => (
                <SelectCard
                  key={key}
                  icon={icon}
                  label={key}
                  selected={category === key}
                  onClick={() => handleCategorySelect(key)}
                />
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={handleCategorySkip}
                style={{ padding: '10px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 3: Business Type ── */
  if (step === 'type') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F9FAFB' }}>
        <Header />
        <div style={{ flex: 1, padding: '32px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setStep('category')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} color="#374151" />
              </button>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Select Business Type
                  {(category || bizName) && <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>({category || bizName})</span>}
                </h2>
                <p style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>This will help us personalize your app experience</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Business Setup:</span>
              <span style={{ padding: '4px 12px', borderRadius: 20, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 12, fontWeight: 700, color: '#374151' }}>Step 2/2</span>
            </div>
          </div>

          {/* Type grid */}
          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {BUSINESS_TYPES.map(({ key, icon }) => (
                <SelectCard
                  key={key}
                  icon={icon}
                  label={key}
                  selected={bizType === key}
                  onClick={() => setBizType(key)}
                />
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={() => handleFinish(true)}
                disabled={saving}
                style={{ padding: '10px 24px', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
              >
                Skip
              </button>
              <button
                onClick={() => handleFinish(false)}
                disabled={saving || !bizType}
                style={{
                  padding: '11px 32px', borderRadius: 8, border: 'none',
                  background: bizType && !saving ? '#2563EB' : '#D1D5DB',
                  color: bizType && !saving ? 'white' : '#9CA3AF',
                  fontSize: 14, fontWeight: 700,
                  cursor: bizType && !saving ? 'pointer' : 'not-allowed',
                }}
              >
                {saving ? 'Creating…' : 'Next'}
              </button>
            </div>
            {error && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 8, textAlign: 'center' }}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
