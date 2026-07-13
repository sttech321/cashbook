import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, LogOut, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppDownloadButtons from '../components/shared/AppDownloadButtons';

/* ── Simple Toggle switch ─────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
        background: on ? '#2563EB' : '#D1D5DB',
        position: 'relative', transition: 'background 200ms', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 200ms',
      }} />
    </div>
  );
}

/* ── Inline editable field ────────────────────────────── */
function EditableField({ label, value, onSave, placeholder = '', type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value || ''); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed !== (value || '')) onSave(trimmed);
    setEditing(false);
  };

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {editing ? (
          <>
            <input
              ref={inputRef}
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
              onBlur={save}
              placeholder={placeholder}
              style={{
                flex: 1, fontSize: 14, padding: '6px 0',
                border: 'none', borderBottom: '1.5px solid #2563EB',
                outline: 'none', background: 'transparent', color: '#111827',
              }}
            />
            <div onClick={save} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
              <Check size={15} color="#2563EB" />
            </div>
          </>
        ) : (
          <>
            <span style={{ flex: 1, fontSize: 14, color: value ? '#111827' : '#9CA3AF' }}>
              {value || placeholder}
            </span>
            <div
              onClick={() => setEditing(true)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Pencil size={14} color="#6B7280" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Phone mockup for the app banner ─────────────────── */
function PhoneMockup() {
  const rows = [
    { date: 'Feb 16, 9 PM', label: 'Petrol',  amount: '+1280', balance: '28000', color: '#22C55E' },
    { date: 'Feb 1, 1 PM',  label: 'Payment', amount: '+450',  balance: '29280', color: '#22C55E' },
    { date: 'Feb 1, 1 PM',  label: 'Grocery', amount: '-450',  balance: '',      color: '#EF4444' },
  ];

  return (
    <div style={{
      width: 160, background: '#1F2937', borderRadius: 18,
      padding: '10px 8px', border: '2px solid #374151',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Notch */}
      <div style={{ width: 40, height: 5, background: '#374151', borderRadius: 4, margin: '0 auto 8px' }} />
      {/* App content */}
      <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', padding: '10px 8px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Business Expenses</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[['Cash In', '+', '#22C55E', '30000'], ['Cash Out', '-', '#EF4444', '2000']].map(([lbl, icon, clr, val]) => (
            <div key={lbl} style={{ flex: 1, background: '#F9FAFB', borderRadius: 4, padding: '4px 5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: clr, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, color: 'white', fontWeight: 700 }}>{icon}</div>
                <span style={{ fontSize: 7, color: '#6B7280' }}>{lbl}</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#111827' }}>{val}</div>
            </div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: i < rows.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
            <div>
              <div style={{ fontSize: 7, color: '#9CA3AF' }}>{r.date}</div>
              <div style={{ fontSize: 8, fontWeight: 600, color: '#374151' }}>{r.label}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: r.color }}>{r.amount}</div>
              {r.balance && <div style={{ fontSize: 7, color: '#9CA3AF' }}>{r.balance}</div>}
            </div>
          </div>
        ))}
        {/* skeleton rows */}
        {[1, 2].map((i) => (
          <div key={i} style={{ height: 6, background: '#F3F4F6', borderRadius: 3, marginTop: 5 }} />
        ))}
      </div>
    </div>
  );
}

/* ── Mobile App Banner ────────────────────────────────── */
function MobileAppBanner() {
  return (
    <div style={{
      marginTop: 16, borderRadius: 12, overflow: 'hidden',
      display: 'flex', background: '#3D52D5',
      minHeight: 180,
    }}>
      {/* Left — phone mockup */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '20px 0 0', background: 'linear-gradient(135deg, #4F63E0 0%, #3D52D5 100%)',
      }}>
        <PhoneMockup />
      </div>

      {/* Right — info */}
      <div style={{ flex: 1, padding: '24px 24px 24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 12, color: '#BAC4FF', marginBottom: 4 }}>Checkout the</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 12 }}>Mobile App</div>
        {['Offline Support', 'Book Sharing', 'Data Backup'].map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#22C55E',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Check size={8} color="white" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 12, color: '#E0E7FF' }}>{f}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, maxWidth: 320 }}>
          <AppDownloadButtons variant="onBlue" />
        </div>
      </div>
    </div>
  );
}

/* ── Mini header for profile page ────────────────────── */
function ProfileHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDrop, setShowDrop] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 52,
      background: 'white', borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => navigate(-1)}>
        <div style={{ width: 26, height: 26, borderRadius: 5, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 800 }}>C</div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#1E3A8A' }}>CASHBOOK</span>
      </div>

      <div ref={ref} style={{ position: 'relative' }}>
        <div
          onClick={() => setShowDrop((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E7EB' }}
        >
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{initials}</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{displayName}</span>
          <ChevronDown size={13} />
        </div>

        {showDrop && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 200, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
                <div style={{ color: '#6B7280', fontSize: 12 }}>{user?.mobile || user?.email}</div>
                <div style={{ color: '#2563EB', fontSize: 12, marginTop: 2, fontWeight: 500 }}>Your Profile &gt;</div>
              </div>
            </div>
            <div style={{ padding: '4px 0' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 13 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { logout(); navigate('/login'); }}
              >
                <LogOut size={15} color="#EF4444" />
                <span style={{ color: '#EF4444' }}>Logout</span>
              </div>
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid #F3F4F6', fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
              © CashBook • Version 4.6.0
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Main Profile Page ────────────────────────────────── */
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const [profileError, setProfileError] = useState(null);

  const patchProfile = async (fields) => {
    setProfileError(null);
    try {
      const res  = await fetch('/api/auth/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile');
        return;
      }
      // Use full user object from server response
      if (data.user) updateUser(data.user);
      else updateUser(fields);
    } catch {
      setProfileError('Network error. Please try again.');
    }
  };

  const initials = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <ProfileHeader />

      <div style={{ paddingTop: 52 + 32, paddingBottom: 40, display: 'flex', justifyContent: 'center', padding: `${52 + 24}px 16px 40px` }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* Profile card */}
          <div style={{ background: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
              <button
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: '#374151' }}
              >
                <ArrowLeft size={18} />
              </button>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Your Profile Details</span>
            </div>

            {/* Error banner */}
            {profileError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
                marginBottom: 4,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13, color: '#DC2626', flex: 1 }}>{profileError}</span>
                <button onClick={() => setProfileError(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}

            {/* Name */}
            <EditableField
              label="Name"
              value={displayName}
              placeholder="Enter your name"
              onSave={(name) => patchProfile({ name })}
            />

            {/* Mobile */}
            <EditableField
              label="Mobile Number"
              value={user?.mobile || ''}
              placeholder="Enter mobile number"
              type="tel"
              onSave={(mobile) => patchProfile({ mobile })}
            />

            {/* Email */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: 500 }}>Email</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <EmailField value={user?.email || ''} onSave={(email) => patchProfile({ email })} />
                <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>OR</span>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 7,
                  border: '1.5px solid #E5E7EB', background: 'white',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151',
                  flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  <GoogleIcon />
                  Continue With Google
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Notifications</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Get notified for entries from group books</div>
              </div>
              <Toggle on={notifications} onChange={setNotifications} />
            </div>

            {/* Logout */}
            <div
              style={{ padding: '14px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              <LogOut size={16} color="#EF4444" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>Logout</span>
            </div>

            {/* Version */}
            <div style={{ paddingTop: 12, fontSize: 12, color: '#9CA3AF' }}>v4.6.0</div>
          </div>

          {/* Mobile App banner */}
          <MobileAppBanner />
        </div>
      </div>
    </div>
  );
}

/* ── Email field with pencil ──────────────────────────── */
function EmailField({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value || ''); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => { if (draft.trim() !== value) onSave(draft.trim()); setEditing(false); };

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 8,
      border: `1.5px solid ${editing ? '#2563EB' : '#E5E7EB'}`,
      borderRadius: 7, padding: '7px 10px', transition: 'border-color 150ms',
    }}>
      {editing ? (
        <input
          ref={inputRef}
          type="email"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
          onBlur={save}
          placeholder="Enter your email"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#111827', background: 'transparent' }}
        />
      ) : (
        <span style={{ flex: 1, fontSize: 13, color: value ? '#111827' : '#9CA3AF' }}>
          {value || 'Enter your email'}
        </span>
      )}
      <div
        onClick={() => setEditing(v => !v)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
      >
        <Pencil size={13} color={editing ? '#2563EB' : '#6B7280'} />
      </div>
    </div>
  );
}

/* ── Google G icon ────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
