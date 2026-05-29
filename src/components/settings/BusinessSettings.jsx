import { useState } from 'react';
import { Pencil, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STAFF_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const CATEGORIES = ['Retail', 'Manufacturing', 'Services', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Construction', 'Agriculture', 'IT & Technology'];
const SUBCATEGORIES = {
  Retail: ['General Store', 'Clothing', 'Electronics', 'Grocery', 'Pharmacy'],
  Services: ['Consulting', 'Cleaning', 'Security', 'Logistics', 'Catering'],
  IT: ['Software', 'Hardware', 'Networking', 'Cloud Services'],
};
const BUSINESS_TYPES = ['B2B', 'B2C', 'B2B2C', 'D2C'];
const REG_TYPES = ['Sole Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'OPC'];

const S = {
  page: { display: 'flex', minHeight: 'calc(100vh - var(--topbar-height))' },
  leftNav: {
    width: 220, borderRight: '1px solid var(--gray-200)',
    padding: '16px 0', background: 'var(--gray-50)',
  },
  navItem: (active) => ({
    padding: '9px 16px', fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--blue)' : 'var(--gray-700)',
    background: active ? 'var(--blue-light)' : 'transparent',
    cursor: 'pointer',
    borderLeft: active ? '3px solid var(--blue)' : '3px solid transparent',
  }),
  navSection: { padding: '12px 16px 4px', fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 1 },
  content: { flex: 1, padding: '24px 32px', maxWidth: 680 },
  profileCard: {
    border: '1px solid var(--gray-200)', borderRadius: 10,
    padding: '16px 20px', marginBottom: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  bizIconLg: {
    width: 48, height: 48, borderRadius: 8,
    background: 'var(--blue-light)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 22, marginRight: 14,
  },
  incompleteTag: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 11, color: '#D97706', marginBottom: 2,
  },
  strengthBar: {
    height: 6, borderRadius: 3, background: 'var(--gray-200)',
    overflow: 'hidden', width: 200, marginTop: 6,
  },
  infoBox: {
    background: '#EFF6FF', borderRadius: 6, padding: '8px 12px',
    fontSize: 12, color: 'var(--blue)', display: 'flex', gap: 6, alignItems: 'flex-start',
    marginTop: 8, border: '1px solid #BFDBFE',
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--gray-100)' },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, color: 'var(--gray-400)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 },
  fieldRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 6, minHeight: 38 },
  fieldValue: { fontSize: 13, color: 'var(--gray-700)' },
  fieldPlaceholder: { fontSize: 13, color: 'var(--gray-300)' },
  editIcon: { color: 'var(--gray-400)', cursor: 'pointer', flexShrink: 0 },
  selectField: {
    width: '100%', padding: '9px 12px', borderRadius: 6,
    border: '1px solid var(--gray-200)', fontSize: 13,
    color: 'var(--gray-700)', background: 'var(--white)',
    appearance: 'none', outline: 'none', cursor: 'pointer',
  },
};

function EditableField({ label, value, placeholder, onSave, type = 'text', icon }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');

  const save = () => { onSave(val); setEditing(false); };

  return (
    <div style={S.field}>
      {label && (
        <div style={S.fieldLabel}>
          {icon && <span>{icon}</span>}
          {label}
        </div>
      )}
      {editing ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            autoFocus
            type={type}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--blue)', fontSize: 13, outline: 'none' }}
          />
          <button onClick={save} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--blue)', color: 'var(--white)', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: 12, cursor: 'pointer', background: 'var(--white)' }}>✕</button>
        </div>
      ) : (
        <div style={S.fieldRow}>
          {value
            ? <span style={S.fieldValue}>{value}</span>
            : <span style={S.fieldPlaceholder}>{placeholder}</span>
          }
          <Pencil size={14} style={S.editIcon} onClick={() => setEditing(true)} />
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, placeholder, options, onChange, icon }) {
  return (
    <div style={S.field}>
      {label && (
        <div style={S.fieldLabel}>
          {icon && <span>{icon}</span>}
          {label}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...S.selectField, color: value ? 'var(--gray-700)' : 'var(--gray-300)' }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Pencil size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

/* ─── Delete Business Modal ─────────────────────────────────────────────── */
function DeleteBusinessModal({ businessName, onClose }) {
  const [typed, setTyped] = useState('');
  const confirmed = typed === businessName;

  const handleDelete = () => {
    alert('Business deleted!');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 440, maxWidth: '94vw',
        padding: '28px 28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <AlertTriangle size={18} color="#DC2626" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#DC2626' }}>Delete Business</span>
        </div>

        {/* Warning text */}
        <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 18 }}>
          This action is permanent and cannot be undone. All cashbooks, transactions, team members, and data will be permanently deleted.
        </p>

        {/* Input */}
        <label style={{ display: 'block', fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>
          Type your business name to confirm
        </label>
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={businessName}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '9px 12px', borderRadius: 6,
            border: '1px solid var(--gray-200)', fontSize: 13,
            outline: 'none', marginBottom: 20,
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: '1px solid var(--gray-200)', background: '#fff',
              color: 'var(--gray-700)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed}
            style={{
              padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: confirmed ? 'pointer' : 'not-allowed',
              background: confirmed ? '#DC2626' : 'var(--gray-200)',
              color: confirmed ? '#fff' : 'var(--gray-400)',
              transition: 'background 200ms, color 200ms',
            }}
          >
            Delete Business
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Change Primary Admin Modal ────────────────────────────────────────── */
const ROLE_LABELS = {
  PRIMARY_ADMIN: 'Primary Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
};

const ROLE_COLORS = {
  PRIMARY_ADMIN: { bg: '#EEF2FF', color: '#4F46E5' },
  ADMIN: { bg: '#F0FDF4', color: '#16A34A' },
  MANAGER: { bg: '#FFF7ED', color: '#EA580C' },
  STAFF: { bg: '#F8FAFC', color: '#64748B' },
};

function ChangeAdminModal({ teamMembers, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const candidates = teamMembers.filter((m) => !m.isYou);
  const selected = candidates.find((m) => m.id === selectedId);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 460, maxWidth: '94vw',
        padding: '28px 28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* ── Step 1: Select ── */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: 4, fontSize: 16, fontWeight: 700, color: 'var(--gray-800)' }}>
              Change Primary Admin
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
              Select a team member to transfer Primary Admin role to
            </div>

            {candidates.length === 0 ? (
              <div style={{
                padding: '20px 16px', borderRadius: 8,
                border: '1px dashed var(--gray-200)',
                textAlign: 'center', fontSize: 13, color: 'var(--gray-400)',
                marginBottom: 20,
              }}>
                No other team members found. Invite team members first.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {candidates.map((m) => {
                  const roleStyle = ROLE_COLORS[m.role] || ROLE_COLORS.STAFF;
                  const isSelected = selectedId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                        border: isSelected ? '2px solid var(--blue)' : '1px solid var(--gray-200)',
                        background: isSelected ? '#EFF6FF' : '#fff',
                        transition: 'border 150ms, background 150ms',
                      }}
                    >
                      {/* Radio indicator */}
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        border: isSelected ? '5px solid var(--blue)' : '2px solid var(--gray-300)',
                        background: '#fff',
                        transition: 'border 150ms',
                      }} />
                      {/* Avatar */}
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--blue-light)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'var(--blue)',
                      }}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 2 }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{m.mobile || '—'}</div>
                      </div>
                      {/* Role badge */}
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: roleStyle.bg, color: roleStyle.color, flexShrink: 0,
                      }}>
                        {ROLE_LABELS[m.role] || m.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: '1px solid var(--gray-200)', background: '#fff',
                  color: 'var(--gray-700)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedId}
                style={{
                  padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: 'none',
                  background: selectedId ? 'var(--blue)' : 'var(--gray-200)',
                  color: selectedId ? '#fff' : 'var(--gray-400)',
                  cursor: selectedId ? 'pointer' : 'not-allowed',
                  transition: 'background 200ms, color 200ms',
                }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Confirm ── */}
        {step === 2 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 16 }}>
              Are you sure?
            </div>

            {/* Selected member highlight */}
            <div style={{
              background: '#EFF6FF', borderRadius: 8, padding: '12px 16px',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: 'var(--blue-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--blue)',
              }}>
                {selected?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{selected?.name}</div>
                <div style={{ fontSize: 11, color: '#93C5FD' }}>{selected?.mobile || '—'}</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 22 }}>
              Current Primary Admin will become a regular Admin. This cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: '1px solid var(--gray-200)', background: '#fff',
                  color: 'var(--gray-700)', cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer',
                }}
              >
                Confirm Transfer
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#F0FDF4', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={32} color="#16A34A" />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>
              Transfer Initiated!
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: 24 }}>
              OTP has been sent to your registered mobile for verification.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '9px 32px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function BusinessSettings() {
  const { currentBusiness, currentProfile, profileStrength, filledFields, totalFields, updateProfile, teamMembers } = useApp();
  const [activeNav, setActiveNav] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const strengthColor = profileStrength < 50 ? 'var(--red)' : profileStrength < 80 ? 'var(--yellow)' : 'var(--green)';
  const subcategories = SUBCATEGORIES[currentProfile.category] || [];

  return (
    <div style={S.page}>
      {/* Left nav */}
      <div style={S.leftNav}>
        <div style={S.navSection}>Business Profile</div>
        <div style={S.navItem(activeNav === 'profile')} onClick={() => setActiveNav('profile')}>
          Edit business details
        </div>
        <div style={{ height: 1, background: 'var(--gray-200)', margin: '8px 0' }} />
        <div style={S.navSection}>Settings</div>
        <div style={S.navItem(activeNav === 'primary')} onClick={() => setActiveNav('primary')}>
          Change Primary Admin or delete business
        </div>
      </div>

      {/* Content */}
      <div style={S.content}>
        {activeNav === 'profile' && (
          <>
            {/* Profile strength card */}
            <div style={S.profileCard}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={S.bizIconLg}>🏢</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{currentBusiness?.name}</div>
                  <div style={S.incompleteTag}>
                    <AlertTriangle size={12} />
                    Incomplete business profile
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    Profile Strength: <strong style={{ color: strengthColor }}>{profileStrength < 50 ? 'Low' : profileStrength < 80 ? 'Medium' : 'High'}</strong>
                  </div>
                  <div style={S.strengthBar}>
                    <div style={{ height: '100%', width: `${profileStrength}%`, background: strengthColor, borderRadius: 3, transition: 'width 400ms' }} />
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'right' }}>
                <strong style={{ fontSize: 16, color: 'var(--gray-700)' }}>{profileStrength}%</strong>
              </div>
            </div>

            {/* Info box */}
            {totalFields - filledFields > 0 && (
              <div style={S.infoBox}>
                <span>ℹ️</span>
                <span>{totalFields - filledFields} out of {totalFields} fields are incomplete. Fill these to complete your profile</span>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              {/* Basics */}
              <div style={S.section}>
                <div style={S.sectionTitle}>Basics</div>
                <EditableField
                  label="Business Name" icon="🏷️"
                  value={currentBusiness?.name}
                  placeholder="Enter business name"
                  onSave={() => {}}
                />
                <EditableField
                  label="Business Address" icon="📍"
                  value={currentProfile.address}
                  placeholder="Add business address"
                  onSave={(v) => updateProfile({ address: v })}
                />
                <SelectField
                  label="Staff Size" icon="👥"
                  value={currentProfile.staffSize}
                  placeholder="Select staff size"
                  options={STAFF_SIZES}
                  onChange={(v) => updateProfile({ staffSize: v })}
                />
              </div>

              {/* Business Info */}
              <div style={S.section}>
                <div style={S.sectionTitle}>Business Info</div>
                <SelectField
                  label="Business Category" icon="🏭"
                  value={currentProfile.category}
                  placeholder="Select business category"
                  options={CATEGORIES}
                  onChange={(v) => updateProfile({ category: v, subcategory: null })}
                />
                <SelectField
                  label="Business Subcategory" icon="📋"
                  value={currentProfile.subcategory}
                  placeholder="Select business subcategory"
                  options={subcategories}
                  onChange={(v) => updateProfile({ subcategory: v })}
                />
                <SelectField
                  label="Business Type" icon="🏢"
                  value={currentProfile.businessType}
                  placeholder="Select business type"
                  options={BUSINESS_TYPES}
                  onChange={(v) => updateProfile({ businessType: v })}
                />
                <SelectField
                  label="Business Registration Type" icon="📄"
                  value={currentProfile.registrationType}
                  placeholder="Select registration type"
                  options={REG_TYPES}
                  onChange={(v) => updateProfile({ registrationType: v })}
                />
              </div>

              {/* GST Info */}
              <div style={S.section}>
                <div style={S.sectionTitle}>GST Info</div>
                <EditableField
                  label="GST number" icon="#"
                  value={currentProfile.gstin}
                  placeholder="Enter GSTIN"
                  onSave={(v) => updateProfile({ gstin: v })}
                />
              </div>

              {/* Communication */}
              <div style={S.section}>
                <div style={S.sectionTitle}>Communication</div>
                <EditableField
                  label="Business Email" icon="✉️"
                  value={currentProfile.email}
                  placeholder="Enter Business Email"
                  type="email"
                  onSave={(v) => updateProfile({ email: v })}
                />
                <EditableField
                  label="Business Mobile Number" icon="📱"
                  value={currentProfile.mobile}
                  placeholder=""
                  onSave={(v) => updateProfile({ mobile: v })}
                />
              </div>
            </div>
          </>
        )}

        {activeNav === 'primary' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Settings</h2>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Change Primary Admin</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>Transfer Primary Admin role to another team member. The current Primary Admin will become a regular Admin.</div>
                <button
                  onClick={() => setShowAdminModal(true)}
                  style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--blue)', color: 'var(--white)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Change Primary Admin
                </button>
              </div>
              <div style={{ padding: '16px 20px', background: '#FFF5F5' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>Delete Business</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 12 }}>Permanently delete this business and all associated data. This action cannot be undone.</div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--white)', color: 'var(--red)', border: '1px solid var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete Business
                </button>
              </div>
            </div>

            {showDeleteModal && (
              <DeleteBusinessModal
                businessName={currentBusiness?.name}
                onClose={() => setShowDeleteModal(false)}
              />
            )}

            {showAdminModal && (
              <ChangeAdminModal
                teamMembers={teamMembers}
                onClose={() => setShowAdminModal(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
