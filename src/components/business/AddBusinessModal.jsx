import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Category icons (SVG inline) ─────────────────────────── */
const CATEGORY_ICONS = {
  Agriculture: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <path d="M10 26c0-4 4-8 10-8s10 4 10 8" stroke="#2E7D32" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="27" r="3" stroke="#388E3C" strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="27" r="3" stroke="#388E3C" strokeWidth="1.5" fill="none" />
      <path d="M20 18v-6M17 15l3-3 3 3" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 21h4v2h-4z" fill="#66BB6A" rx="1" />
    </svg>
  ),
  Construction: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <path d="M13 27l10-10" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 17l3-3 3 3-3 3z" fill="#1976D2" />
      <rect x="11" y="25" width="6" height="3" rx="1" fill="#42A5F5" transform="rotate(-45 14 26.5)" />
    </svg>
  ),
  Education: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <path d="M12 16h16v12H12z" stroke="#2E7D32" strokeWidth="1.5" fill="#C8E6C9" rx="1" />
      <path d="M16 16v-2h8v2" stroke="#388E3C" strokeWidth="1.5" />
      <path d="M20 16v12" stroke="#388E3C" strokeWidth="1" />
      <path d="M15 20h4M15 23h4M21 20h4M21 23h4" stroke="#43A047" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Electronics: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F7FA" />
      <path d="M16 14h8v12h-8z" stroke="#00838F" strokeWidth="1.5" fill="#B2EBF2" />
      <circle cx="20" cy="26" r="1.5" fill="#00838F" />
      <path d="M18 17h4M18 20h3" stroke="#00838F" strokeWidth="1" strokeLinecap="round" />
      <path d="M13 18h3M24 18h3" stroke="#26C6DA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Financial Services': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <circle cx="20" cy="20" r="8" stroke="#2E7D32" strokeWidth="1.5" fill="#C8E6C9" />
      <path d="M18 17h3c1 0 2 .5 2 2s-1 2-2 2h-3v-4zM17 21h4" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 15v2M20 23v2" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Food/Restaurant': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F2F1" />
      <path d="M16 13v5c0 1.5 1 2.5 2.5 2.5H19v6" stroke="#00695C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M16 13c0 0 0 3 1.5 4.5" stroke="#00897B" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M24 13v14" stroke="#00695C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 13c0 3 2 4 2 4s2-1 2-4" stroke="#00897B" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  ),
  'Clothes/Fashion': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <path d="M15 14l-4 4 3 1v9h12v-9l3-1-4-4c0 0-1 3-5 3s-5-3-5-3z" stroke="#1565C0" strokeWidth="1.5" fill="#BBDEFB" strokeLinejoin="round" />
    </svg>
  ),
  Hardware: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <rect x="17" y="13" width="6" height="12" rx="1" fill="#C8E6C9" stroke="#388E3C" strokeWidth="1.5" />
      <rect x="15" y="25" width="10" height="3" rx="1" fill="#43A047" />
      <path d="M20 13v-2" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 16h6" stroke="#388E3C" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Jewellery: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F7FA" />
      <path d="M20 28L12 18l3-5h10l3 5z" stroke="#00838F" strokeWidth="1.5" fill="#B2EBF2" strokeLinejoin="round" />
      <path d="M17 13l-2 5h10l-2-5zM15 18l5 10 5-10" stroke="#00695C" strokeWidth="1" fill="none" />
    </svg>
  ),
  'Healthcare & Fitness': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <rect x="14" y="14" width="12" height="14" rx="2" fill="#BBDEFB" stroke="#1565C0" strokeWidth="1.5" />
      <path d="M17 18h6M20 15v4" stroke="#1565C0" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="17" y="22" width="6" height="2" rx="1" fill="#42A5F5" />
    </svg>
  ),
  'Kirana/Grocery': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F2F1" />
      <path d="M13 16h14l-2 10H15z" stroke="#00695C" strokeWidth="1.5" fill="#B2DFDB" strokeLinejoin="round" />
      <path d="M11 14h3l2 2" stroke="#00897B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="28" r="1.5" fill="#00695C" />
      <circle cx="23" cy="28" r="1.5" fill="#00695C" />
    </svg>
  ),
  Transport: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F7FA" />
      <path d="M10 22h20v4H10z" fill="#B2EBF2" stroke="#00838F" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 22v-4h12l4 4" fill="#E0F7FA" stroke="#00838F" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="15" cy="27" r="2" fill="#00838F" />
      <circle cx="25" cy="27" r="2" fill="#00838F" />
    </svg>
  ),
  Other: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#42A5F5" />
      <rect x="21" y="13" width="6" height="6" rx="1" fill="#1976D2" />
      <rect x="13" y="21" width="6" height="6" rx="1" fill="#1976D2" />
      <rect x="21" y="21" width="6" height="6" rx="1" fill="#42A5F5" />
    </svg>
  ),
};

const TYPE_ICONS = {
  Retailer: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <circle cx="20" cy="15" r="4" fill="#C8E6C9" stroke="#2E7D32" strokeWidth="1.5" />
      <path d="M12 28c0-4 3.6-7 8-7s8 3 8 7" stroke="#388E3C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="22" y="20" width="7" height="6" rx="1" fill="#43A047" />
      <path d="M24 22h3M24 24h2" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Distributor: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E0F7FA" />
      <path d="M8 22h18v4H8z" fill="#B2EBF2" stroke="#00838F" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 22v-4h12l4 4" fill="#E0F7FA" stroke="#00838F" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="13" cy="27" r="2" fill="#00838F" />
      <circle cx="23" cy="27" r="2" fill="#00838F" />
      <path d="M28 19l3 3-3 1.5" stroke="#26C6DA" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  Manufacturer: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <rect x="12" y="18" width="16" height="10" rx="1" fill="#BBDEFB" stroke="#1565C0" strokeWidth="1.5" />
      <path d="M12 22l4-4 4 4 4-4 4 4" stroke="#1976D2" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <rect x="16" y="23" width="8" height="5" rx="1" fill="#42A5F5" />
      <path d="M20 23v5" stroke="#1565C0" strokeWidth="1" />
    </svg>
  ),
  'Service Provider': (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E8F5E9" />
      <path d="M14 22c0-2 1-4 3-5l3 4 3-5c2 1 3 3 3 6H14z" fill="#C8E6C9" stroke="#388E3C" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M17 20l2 2 4-5" stroke="#2E7D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  Trader: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <path d="M12 26l5-5 4 3 7-9" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="17" cy="21" r="1.5" fill="#42A5F5" />
      <circle cx="21" cy="24" r="1.5" fill="#42A5F5" />
      <circle cx="28" cy="15" r="1.5" fill="#1976D2" />
    </svg>
  ),
  Other: (
    <svg viewBox="0 0 40 40" width="28" height="28">
      <circle cx="20" cy="20" r="20" fill="#E3F2FD" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#42A5F5" />
      <rect x="21" y="13" width="6" height="6" rx="1" fill="#1976D2" />
      <rect x="13" y="21" width="6" height="6" rx="1" fill="#1976D2" />
      <rect x="21" y="21" width="6" height="6" rx="1" fill="#42A5F5" />
    </svg>
  ),
};

const CATEGORIES = [
  'Agriculture', 'Construction', 'Education', 'Electronics',
  'Financial Services', 'Food/Restaurant', 'Clothes/Fashion', 'Hardware',
  'Jewellery', 'Healthcare & Fitness', 'Kirana/Grocery', 'Transport', 'Other',
];

const TYPES = ['Retailer', 'Distributor', 'Manufacturer', 'Service Provider', 'Trader', 'Other'];

/* ── Selection Card ──────────────────────────────────────── */
function SelectCard({ label, icon, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
        border: selected ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
        background: selected ? '#EFF6FF' : 'white',
        transition: 'all 150ms',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.background = '#F8FAFF'; } }}
      onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; } }}
    >
      {icon}
      <span style={{ fontSize: 13, fontWeight: 500, color: selected ? '#1D4ED8' : '#374151' }}>{label}</span>
    </div>
  );
}

/* ── Accordion Section ───────────────────────────────────── */
function AccordionSection({ title, subtitle, open, onToggle, children }) {
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', cursor: 'pointer', background: 'white',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{title}</div>
          <div style={{ fontSize: 12, color: open ? '#2563EB' : '#6B7280', marginTop: 2 }}>{subtitle}</div>
        </div>
        {open ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
      </div>
      {open && (
        <div style={{ padding: '4px 16px 16px', borderTop: '1px solid #F3F4F6' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Main Modal ──────────────────────────────────────────── */
export default function AddBusinessModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) { setNameError(true); return; }
    setCreating(true);
    setTimeout(() => {
      onAdd({ name: name.trim(), category, businessType });
      setCreating(false);
      onClose();
    }, 400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 400,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 620, maxWidth: '100vw',
        background: 'white',
        zIndex: 500,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid #E5E7EB',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Add New Business</h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 6,
              border: 'none', background: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7280',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Business Name */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: nameError ? '#DC2626' : '#374151', display: 'block', marginBottom: 6 }}>
              Business Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(false); }}
              placeholder="Add Business Name"
              style={{
                width: '100%', padding: '11px 14px',
                border: nameError ? '1.5px solid #DC2626' : '1px solid #D1D5DB',
                borderRadius: 8, fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 150ms',
              }}
              onFocus={(e) => { if (!nameError) e.target.style.borderColor = '#2563EB'; }}
              onBlur={(e) => { if (!nameError) e.target.style.borderColor = '#D1D5DB'; }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
            />
            {nameError && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>Business name is required</p>}
          </div>

          {/* Category Accordion */}
          <AccordionSection
            title="Select Business Category"
            subtitle="This will help us personalize your business"
            open={catOpen}
            onToggle={() => setCatOpen((v) => !v)}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 12 }}>
              {CATEGORIES.map((c) => (
                <SelectCard
                  key={c}
                  label={c}
                  icon={CATEGORY_ICONS[c]}
                  selected={category === c}
                  onClick={() => setCategory(category === c ? '' : c)}
                />
              ))}
            </div>
          </AccordionSection>

          {/* Type Accordion */}
          <AccordionSection
            title="Select Business Type"
            subtitle="This will help us personalize your business"
            open={typeOpen}
            onToggle={() => setTypeOpen((v) => !v)}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 12 }}>
              {TYPES.map((t) => (
                <SelectCard
                  key={t}
                  label={t}
                  icon={TYPE_ICONS[t]}
                  selected={businessType === t}
                  onClick={() => setBusinessType(businessType === t ? '' : t)}
                />
              ))}
            </div>
          </AccordionSection>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid #E5E7EB',
          display: 'flex', justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          <button
            onClick={handleCreate}
            disabled={creating}
            style={{
              padding: '11px 28px',
              background: creating ? '#9CA3AF' : '#3D52D5',
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer',
              transition: 'background 200ms',
            }}
            onMouseEnter={(e) => { if (!creating) e.currentTarget.style.background = '#2563EB'; }}
            onMouseLeave={(e) => { if (!creating) e.currentTarget.style.background = '#3D52D5'; }}
          >
            {creating ? 'Creating…' : 'Create Business'}
          </button>
        </div>
      </div>
    </>
  );
}
