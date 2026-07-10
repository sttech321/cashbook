import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Copy, Trash2, Plus, Upload, BookOpen, MoreVertical,
  Search, X, ChevronRight, UserPlus, Check, Info, Pencil,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api';

/* ─── Avatar color ──────────────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: '#0891B2', color: '#fff' }, // cyan
  { bg: '#7C3AED', color: '#fff' }, // violet
  { bg: '#DB2777', color: '#fff' }, // pink
  { bg: '#059669', color: '#fff' }, // emerald  ← S, C, K
  { bg: '#2563EB', color: '#fff' }, // blue
  { bg: '#D97706', color: '#fff' }, // amber
  { bg: '#9333EA', color: '#fff' }, // purple
  { bg: '#DC2626', color: '#fff' }, // red       ← G, O, W
];
function avatarColor(name) {
  const idx = (name || 'U').toUpperCase().charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

/* ─── Role definitions ──────────────────────────────────────── */
const ROLE_DATA = {
  'Data Operator': {
    permissions: ['Add Cash In/Cash Out entries', 'View entries by everyone', 'View net balance & download PDF or Excel'],
    restrictions: ['Cannot edit or delete entries'],
  },
  'Viewer': {
    permissions: ['View entries by everyone', 'View net balance & download PDF or Excel'],
    restrictions: ['Cannot add, edit or delete entries'],
  },
  'Book Admin': {
    permissions: ['Add Cash In/Cash Out entries', 'Edit and delete entries', 'View entries by everyone', 'View net balance & download PDF or Excel'],
    restrictions: [],
  },
};

const ROLE_BADGE = {
  'Primary Admin': { bg: '#DCFCE7', color: '#16A34A' },
  'Book Admin': { bg: '#DBEAFE', color: '#1D4ED8' },
  'Data Operator': { bg: '#F3F4F6', color: '#374151' },
  'Viewer': { bg: '#F3F4F6', color: '#374151' },
};

/* ─── Toggle switch ─────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: 38, height: 22, borderRadius: 11, cursor: 'pointer', background: on ? 'var(--blue)' : 'var(--gray-300)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

/* ─── Role permissions view ─────────────────────────────────── */
function RolePermissions({ role, selected, onSelect }) {
  const data = ROLE_DATA[role] || { permissions: [], restrictions: [] };
  return (
    <div style={{ border: `1.5px solid ${selected ? 'var(--blue)' : 'var(--gray-200)'}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }} onClick={() => onSelect && onSelect(role)}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--gray-100)' }}>
        {['Data Operator', 'Viewer', 'Book Admin'].map((r) => (
          <button key={r} onClick={(e) => { e.stopPropagation(); onSelect && onSelect(r); }} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: `1.5px solid ${selected === r || role === r ? 'var(--blue)' : 'var(--gray-200)'}`,
            background: (selected === r || role === r) ? 'var(--blue-light)' : 'var(--white)',
            color: (selected === r || role === r) ? 'var(--blue)' : 'var(--gray-600)',
          }}>{r}</button>
        ))}
      </div>
      <div style={{ padding: '12px 14px' }}>
        {data.permissions.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>Permissions</div>
            {data.permissions.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, fontSize: 13, color: 'var(--gray-700)' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="white" />
                </div>
                {p}
              </div>
            ))}
          </>
        )}
        {data.restrictions.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginTop: 10, marginBottom: 8 }}>Restrictions</div>
            {data.restrictions.map((r) => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={10} color="white" />
                </div>
                {r}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Rename modal ──────────────────────────────────────────── */
function RenameModal({ bookName, onRename, onClose }) {
  const [name, setName] = useState(bookName);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 380, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Rename Book</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '20px' }}>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--blue)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--gray-100)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (name.trim()) { onRename(name.trim()); onClose(); } }} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Book modal ─────────────────────────────────────── */
function DeleteBookModal({ bookName, onDelete, onClose }) {
  const [input, setInput] = useState('');
  const match = input === bookName;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 380, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Delete Book</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16, lineHeight: 1.5 }}>This will permanently delete <strong>{bookName}</strong> and all its entries. Type the book name to confirm.</p>
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder={bookName} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', border: `1px solid ${match ? '#DC2626' : 'var(--gray-200)'}` }} />
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--gray-100)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (match) { onDelete(); onClose(); } }} disabled={!match} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 600, background: match ? '#DC2626' : 'var(--gray-200)', color: match ? 'white' : 'var(--gray-400)', cursor: match ? 'pointer' : 'not-allowed' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Duplicate Book modal ──────────────────────────────────── */
function DuplicateBookModal({ book, onClose, onDuplicate }) {
  const [name, setName] = useState('');
  const [settings, setSettings] = useState({ members: true, categories: true, paymentModes: true, party: true, customFields: true });
  const [saving, setSaving] = useState(false);
  const items = [
    { key: 'members', label: 'Members & Roles' },
    { key: 'categories', label: 'Categories' },
    { key: 'paymentModes', label: 'Payment Modes' },
    { key: 'party', label: 'Party' },
    { key: 'customFields', label: 'Custom Fields' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Duplicate {book.name}</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '10px 20px', background: '#EFF6FF', borderBottom: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={14} color="var(--blue)" />
          <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>Create new book with same settings as {book.name}</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 10 }}>
              Step 1 : <span style={{ color: 'var(--blue)' }}>Choose New Book Name</span>
            </div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>
              Enter new book name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter new book name"
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--blue)', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>
              Step 2 : <span style={{ color: 'var(--blue)' }}>Choose settings to duplicate</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, border: '1px solid var(--gray-200)', cursor: 'pointer', background: settings[key] ? '#F8FAFF' : 'var(--white)' }}>
                  <input type="checkbox" checked={settings[key]} onChange={() => setSettings((p) => ({ ...p, [key]: !p[key] }))} style={{ accentColor: 'var(--blue)', width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--gray-100)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 7, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>
            <X size={13} /> Cancel
          </button>
          <button
            disabled={!name.trim() || saving}
            onClick={async () => { if (!name.trim() || saving) return; setSaving(true); try { await onDuplicate(name.trim()); onClose(); } catch (err) { alert(err.message); } finally { setSaving(false); } }}
            style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: name.trim() ? 'var(--blue)' : 'var(--gray-200)', color: name.trim() ? 'white' : 'var(--gray-400)', fontSize: 13, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'not-allowed' }}
          >
            {saving ? 'Creating...' : 'Add New Book'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Remove member modal ───────────────────────────────────── */
function RemoveMemberModal({ member, bookName, onConfirm, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 800 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Remove {member.name} from {bookName}?</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-500)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 14 }}>Are you sure?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              <><span style={{ color: '#374151' }}>{member.name} will lose access to </span><span style={{ color: 'var(--blue)', fontWeight: 500 }}>this book</span></>,
              <><span style={{ color: '#374151' }}>We will also notify </span><span style={{ color: '#DC2626', fontWeight: 500 }}>{member.name}</span><span style={{ color: '#374151' }}> that they have been removed from </span><span style={{ color: 'var(--blue)', fontWeight: 500 }}>this book.</span></>,
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gray-400)', marginTop: 5, flexShrink: 0, display: 'inline-block' }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#EFF6FF', borderRadius: 8 }}>
            <Info size={14} color="var(--blue)" />
            <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{member.name} will still be a part of your business</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '14px 20px', borderTop: '1px solid var(--gray-100)' }}>
          <button onClick={onClose} style={{ padding: '10px 28px', borderRadius: 7, border: '1.5px solid var(--gray-200)', background: 'var(--white)', fontSize: 14, fontWeight: 500, color: 'var(--gray-700)', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--white)'}
          >Cancel</button>
          <button onClick={async () => { try { await onConfirm(); } catch {} onClose(); }} style={{ padding: '10px 28px', borderRadius: 7, border: 'none', background: '#DC2626', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
          >Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast notification ────────────────────────────────────── */
function Toast({ message, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3500);
    return () => clearTimeout(t);
  }, [onHide]);
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 20px', borderRadius: 10,
      background: '#1F2937', color: '#fff',
      fontSize: 13, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
      zIndex: 99999, whiteSpace: 'nowrap',
      animation: 'fadeInUp 200ms ease',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5l3 3 6-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {message}
    </div>
  );
}

/* ─── Change Role panel ─────────────────────────────────────── */
function ChangeRolePanel({ member, bookName, onUpdate, onClose }) {
  const [role, setRole] = useState(member.role === 'Primary Admin' ? 'Book Admin' : member.role);
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 700 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--white)', zIndex: 800, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 30px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex', padding: 2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Change {member.name}'s Role</span>
          </div>
          <button onClick={onClose} style={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-500)', padding: 2 }}><X size={18} /></button>
        </div>
        <div style={{ padding: '10px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Book: <strong style={{ color: 'var(--gray-800)' }}>{bookName}</strong></span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--gray-100)' }}>
              {['Data Operator', 'Viewer', 'Book Admin'].map((r) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  border: `1.5px solid ${role === r ? 'var(--blue)' : 'var(--gray-200)'}`,
                  background: role === r ? 'var(--blue-light)' : 'var(--white)',
                  color: role === r ? 'var(--blue)' : 'var(--gray-600)',
                }}>{r}</button>
              ))}
            </div>
            <div style={{ padding: '14px' }}>
              {(ROLE_DATA[role]?.permissions || []).length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10 }}>Permissions</div>
                  {(ROLE_DATA[role]?.permissions || []).map((p) => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={10} color="white" /></div>
                      {p}
                    </div>
                  ))}
                </>
              )}
              {(ROLE_DATA[role]?.restrictions || []).length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginTop: 12, marginBottom: 10 }}>Restrictions</div>
                  {(ROLE_DATA[role]?.restrictions || []).map((r) => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={10} color="white" /></div>
                      {r}
                    </div>
                  ))}
                </>
              )}
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Info size={12} /> You can change this role later
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-100)' }}>
          <button onClick={async () => { try { await onUpdate(member.id, role); } catch {} onClose(); }} style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Update</button>
        </div>
      </div>
    </>
  );
}

/* ─── Success modal ─────────────────────────────────────────── */
function SuccessModal({ memberName, role, bookName, totalCount, onAddMore, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 16, width: 440, padding: 32, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>Added in {bookName}</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Check size={32} color="white" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{memberName} added as {role}!</div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>Your new team count is {totalCount}. Add more members from your team</div>
        <button onClick={onAddMore} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <UserPlus size={16} /> Add more members
        </button>
      </div>
    </div>
  );
}

/* ─── Add New Member modal ──────────────────────────────────── */
function AddNewMemberModal({ businessName, bookName, onAdd, onClose }) {
  const [step, setStep]           = useState(1);
  const [inputMode, setInputMode] = useState('email'); // 'email' | 'mobile'
  const [email, setEmail]         = useState('');
  const [mobile, setMobile]       = useState('');
  const [name, setName]           = useState('');
  const [userId, setUserId]       = useState(null);
  const [lookupState, setLookupState] = useState('idle'); // 'idle'|'checking'|'found'|'notfound'
  const [role, setRole]           = useState('Data Operator');
  const [adding, setAdding]       = useState(false);
  const debounceRef               = useRef(null);

  const isValidEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidMobile = /^\d{10}$/.test(mobile.trim());
  const canNext       = lookupState === 'found';

  const resetLookup = () => { setUserId(null); setName(''); setLookupState('idle'); };

  const runLookup = (lookupFn, valid) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!valid) { setLookupState('idle'); return; }
    setLookupState('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await lookupFn();
        if (data.found) {
          setName(data.user.name || '');
          setUserId(data.user.id);
          setLookupState('found');
        } else {
          setLookupState('notfound');
        }
      } catch { setLookupState('notfound'); }
    }, 600);
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    resetLookup();
    const trimmed = val.trim();
    runLookup(() => api.users.lookupByEmail(trimmed), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed));
  };

  const handleMobileChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setMobile(digits);
    resetLookup();
    runLookup(() => api.users.lookupByMobile(digits), /^\d{10}$/.test(digits));
  };

  const switchMode = (mode) => {
    setInputMode(mode);
    setEmail(''); setMobile('');
    resetLookup();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const handleNext   = () => { if (canNext) setStep(2); };
  const displayValue = inputMode === 'email' ? email.trim() : `+91${mobile}`;

  const handleConfirm = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await onAdd({
        name:    name.trim() || displayValue,
        email:   inputMode === 'email'  ? email.trim() : undefined,
        mobile:  inputMode === 'mobile' ? `+91${mobile}` : undefined,
        role,
        user_id: userId,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const initials = (name || displayValue || '?')[0].toUpperCase();

  // Icon helpers
  const SpinIcon  = () => <div style={{ width: 14, height: 14, border: '2px solid #E5E7EB', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
  const OkIcon    = () => <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
  const inputBorder = (valid) => lookupState === 'found' ? '#16A34A' : lookupState === 'notfound' ? '#DC2626' : valid ? 'var(--blue)' : 'var(--gray-200)';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Add New Member</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-500)' }} onClick={onClose} />
        </div>

        {step === 1 && (
          <div style={{ padding: '24px 20px' }}>
            {/* Email / Mobile tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 16, border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
              {['email', 'mobile'].map((mode) => (
                <button key={mode} onClick={() => switchMode(mode)} style={{
                  flex: 1, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: inputMode === mode ? 'var(--blue)' : 'var(--white)',
                  color: inputMode === mode ? '#fff' : 'var(--gray-500)',
                  transition: 'background 150ms, color 150ms',
                }}>
                  {mode === 'email' ? 'Email' : 'Mobile'}
                </button>
              ))}
            </div>

            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, padding: '20px' }}>
              {/* Email input */}
              {inputMode === 'email' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>
                    Enter Email Address <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input autoFocus type="email" value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && canNext) handleNext(); }}
                      placeholder="e.g. member@gmail.com"
                      style={{ width: '100%', padding: '9px 36px 9px 12px', border: `1px solid ${inputBorder(isValidEmail)}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
                    />
                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                      {lookupState === 'checking' && <SpinIcon />}
                      {lookupState === 'found'    && <OkIcon />}
                      {lookupState === 'notfound' && <X size={14} color="#DC2626" />}
                    </div>
                  </div>
                  {lookupState === 'found'    && <div style={{ fontSize: 12, color: '#16A34A', marginTop: 5, fontWeight: 500 }}>CashBook user found! Name auto-filled.</div>}
                  {lookupState === 'notfound' && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 5 }}>No CashBook user found with this email.</div>}
                </div>
              )}

              {/* Mobile input */}
              {inputMode === 'mobile' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>
                    Enter Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 14, color: 'var(--gray-700)', fontWeight: 600, whiteSpace: 'nowrap', background: 'var(--gray-50)' }}>+91</div>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input autoFocus type="tel" value={mobile} maxLength={10}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && canNext) handleNext(); }}
                        placeholder="10-digit number"
                        style={{ width: '100%', padding: '9px 36px 9px 12px', border: `1px solid ${inputBorder(isValidMobile)}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
                      />
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                        {lookupState === 'checking' && <SpinIcon />}
                        {lookupState === 'found'    && <OkIcon />}
                        {lookupState === 'notfound' && <X size={14} color="#DC2626" />}
                      </div>
                    </div>
                  </div>
                  {lookupState === 'found'    && <div style={{ fontSize: 12, color: '#16A34A', marginTop: 5, fontWeight: 500 }}>CashBook user found! Name auto-filled.</div>}
                  {lookupState === 'notfound' && <div style={{ fontSize: 12, color: '#DC2626', marginTop: 5 }}>No CashBook user found with this mobile number.</div>}
                </div>
              )}

              {/* Auto-filled name */}
              {lookupState === 'found' && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>Name</label>
                  <input readOnly value={name}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #16A34A', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#F0FDF4', color: 'var(--gray-800)', cursor: 'default' }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={onClose} style={{ padding: '9px 24px', borderRadius: 7, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>Cancel</button>
              <button onClick={handleNext} disabled={!canNext}
                style={{ padding: '9px 28px', borderRadius: 7, border: 'none', background: canNext ? 'var(--blue)' : 'var(--gray-200)', color: canNext ? 'white' : 'var(--gray-400)', fontSize: 13, fontWeight: 600, cursor: canNext ? 'pointer' : 'not-allowed' }}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '0 0 20px' }}>
            {/* Info banner — shown when this is a registered CashBook user */}
            {userId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}>
                <Info size={15} color="#2563EB" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 500 }}>{name} will be added to this business too</span>
              </div>
            )}

            <div style={{ padding: '14px 20px 0' }}>
              <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 14 }}>
                {userId
                  ? <>{name} is already using CashBook. Choose their role in this book to add them.</>
                  : inputMode === 'email'
                    ? <>An invitation will be sent to <strong>{email}</strong> to join this book.</>
                    : <>Member <strong>{name}</strong> will be invited via mobile <strong>+91{mobile}</strong>.</>
                }
              </p>
            </div>

            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', border: '1px solid var(--gray-200)', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 700, color: 'var(--blue)' }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>{name || displayValue}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inputMode === 'mobile' ? `+91${mobile}` : email}
                  </div>
                </div>
                {userId && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap' }}>CashBook User</span>
                )}
              </div>

              <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '14px 14px 8px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--gray-100)', color: 'var(--gray-900)' }}>Choose Role</div>
                <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--gray-100)', flexWrap: 'wrap' }}>
                  {['Data Operator', 'Viewer', 'Book Admin'].map((r) => (
                    <button key={r} onClick={() => setRole(r)} style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      border: `1.5px solid ${role === r ? 'var(--blue)' : 'var(--gray-200)'}`,
                      background: role === r ? 'var(--blue-light)' : 'var(--white)',
                      color: role === r ? 'var(--blue)' : 'var(--gray-600)',
                    }}>{r}</button>
                  ))}
                </div>
                <div style={{ padding: '12px 14px' }}>
                  {(ROLE_DATA[role]?.permissions || []).length > 0 && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>Permissions</div>
                      {(ROLE_DATA[role]?.permissions || []).map((p) => (
                        <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, fontSize: 13, color: 'var(--gray-700)' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={10} color="white" /></div>
                          {p}
                        </div>
                      ))}
                    </>
                  )}
                  {(ROLE_DATA[role]?.restrictions || []).length > 0 && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginTop: 10, marginBottom: 8 }}>Restrictions</div>
                      {(ROLE_DATA[role]?.restrictions || []).map((r) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={10} color="white" /></div>
                          {r}
                        </div>
                      ))}
                    </>
                  )}
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Info size={12} /> You can change this role later
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '0 20px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '9px 20px', borderRadius: 7, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--blue)', fontWeight: 500 }}>
                {inputMode === 'mobile' ? 'Change Mobile Number' : 'Change Email'}
              </button>
              <button onClick={handleConfirm} disabled={adding} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 7, border: 'none', background: adding ? '#93C5FD' : 'var(--blue)', color: 'white', fontSize: 13, fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer' }}>
                <UserPlus size={14} /> {adding ? 'Adding...' : '+ ADD'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Add member slide-over panel ───────────────────────────── */
function AddMemberPanel({ businessName, bookName, bookMembers, businessTeam, onAddTeamMember, onAddNew, onClose }) {
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState(null);

  // Set of user_ids already in book
  const inBookUserIds = new Set(bookMembers.map(m => m.user_id).filter(Boolean));

  const staffToShow = (businessTeam || []).filter(m =>
    !m.is_owner &&
    (m.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (tm) => {
    if (addingId) return;
    setAddingId(tm.id);
    try {
      await onAddTeamMember({ name: tm.name, mobile: tm.mobile || '', user_id: tm.user_id || null, role: 'Data Operator' });
    } catch (err) {
      alert(err.message || 'Failed to add member');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 700 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: 'var(--white)', zIndex: 800, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 30px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>Add from {businessName}</span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex', padding: 2 }}><X size={18} /></button>
        </div>
        <div style={{ padding: '10px 20px', background: '#EFF6FF', borderBottom: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={13} color="var(--blue)" />
          <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>You can add members to this book from the staff of "{businessName}"</span>
        </div>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 7, background: 'var(--gray-50)' }}>
            <Search size={13} color="var(--gray-400)" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or number..."
              style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: 13 }} />
            <kbd style={{ padding: '1px 5px', background: 'var(--gray-200)', borderRadius: 3, fontSize: 11, color: 'var(--gray-500)' }}>/</kbd>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div
            onClick={onAddNew}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserPlus size={18} color="var(--blue)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>Add New Member</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Invite members who are not part of your business yet</div>
            </div>
            <ChevronRight size={16} color="var(--gray-400)" />
          </div>

          <div style={{ padding: '10px 20px 6px', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)' }}>Members of {businessName}</div>

          {staffToShow.length === 0 ? (
            <div style={{ padding: '16px 20px', fontSize: 13, color: 'var(--gray-400)' }}>
              {(businessTeam || []).filter(m => !m.is_owner).length === 0
                ? 'There are no staff members in business!'
                : 'No results found'}
            </div>
          ) : staffToShow.map((m) => {
            const alreadyInBook = inBookUserIds.has(m.user_id);
            const isAdding = addingId === m.id;
            return (
              <div key={m.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--gray-100)' }}
                onMouseEnter={e => { if (!alreadyInBook) e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {(() => { const ac = avatarColor(m.name); return (
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: ac.color, flexShrink: 0 }}>
                    {(m.name || '?')[0].toUpperCase()}
                  </div>
                ); })()}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{m.mobile || m.email || ''}</div>
                </div>
                {alreadyInBook ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#16A34A', flexShrink: 0 }}>
                    <Check size={13} /> ADDED
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(m)}
                    disabled={isAdding}
                    style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: isAdding ? '#E5E7EB' : 'var(--blue)', color: isAdding ? '#9CA3AF' : 'white', fontSize: 12, fontWeight: 600, cursor: isAdding ? 'default' : 'pointer', flexShrink: 0 }}>
                    {isAdding ? '...' : 'ADD'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── Add Category / Party modals ───────────────────────────── */
function AddPartyModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 360, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Add Party</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '20px' }}>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Party / Customer Name" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--blue)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--gray-100)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); onClose(); } }} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

function AddCategoryModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 600 }} onClick={onClose}>
      <div style={{ background: 'var(--white)', borderRadius: 12, width: 360, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Add Category</span>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <div style={{ padding: '20px' }}>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--blue)', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: '1px solid var(--gray-100)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); onClose(); } }} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function BookSettings() {
  const { businessId, bookId } = useParams();
  const { cashbooks, renameCashbook, deleteCashbook, addCashbook, currentBusiness, user } = useApp();
  const isPrimaryAdmin = !currentBusiness?.my_role || currentBusiness?.my_role === 'Primary Admin';
  const navigate = useNavigate();
  const book = cashbooks.find((b) => b.id === bookId);

  const [activeTab, setActiveTab] = useState('members');
  const [activeSection, setActiveSection] = useState('party');

  /* members */
  const [bookMembers, setBookMembers] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [businessTeam, setBusinessTeam] = useState([]);
  const [memberMenuId, setMemberMenuId] = useState(null);
  const [changeRoleTarget, setChangeRoleTarget] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [successAdded, setSuccessAdded] = useState(null);
  const [toast, setToast] = useState(null);

  /* data operator role permissions */
  const [dataOpPerms, setDataOpPerms] = useState({
    add_entries: true, edit_own: false, delete_own: false,
    view_all: true, view_balance: true, download: true,
  });

  /* entry field */
  const [showParty, setShowParty] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [categoryRequired, setCategoryRequired] = useState(false);
  const [parties, setParties] = useState([]);
  const [categories, setCategories] = useState([]);

  /* book modals */
  const [modal, setModal] = useState(null);

  const menuRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMemberMenuId(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const loadMembers = useCallback(async () => {
    try {
      const { members } = await api.members.list(businessId, bookId);
      const mapped = members.map(m => ({
        id: m.id,
        user_id: m.user_id,
        name: m.name || 'Unknown',
        mobile: m.mobile || '',
        email: m.email || '',
        employee_id: m.employee_id || null,
        role: m.role,
        isYou: user?.id ? m.user_id === user.id : m.is_owner,
      }));
      const sorted = [...mapped].sort((a, b) => (b.isYou ? 1 : 0) - (a.isYou ? 1 : 0));
      setBookMembers(sorted);
      setAddedIds(new Set(mapped.map(m => m.id)));
    } catch (err) {
      console.error('[members load]', err.message);
    }
  }, [businessId, bookId, user?.id]);

  // Current user's role in this book (derived from loaded members)
  const myBookRole = bookMembers.find(m => m.isYou)?.role || null;
  // Can add members: Primary Admin (business owner) OR Book Admin (book role)
  const canManageBook = isPrimaryAdmin || myBookRole === 'Book Admin';

  useEffect(() => { loadMembers(); }, [loadMembers]);

  // Fetch business team when add panel opens (for the "Members of business" list)
  useEffect(() => {
    if (!showAddPanel || !businessId) return;
    api.team.list(businessId)
      .then(({ members }) => setBusinessTeam(members || []))
      .catch(() => {});
  }, [showAddPanel, businessId]);

  if (!book) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate(`/businesses/${businessId}/cashbooks`)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontSize: 13, cursor: 'pointer', border: 'none', background: 'none' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <p style={{ marginTop: 16, color: 'var(--gray-500)' }}>Book not found.</p>
      </div>
    );
  }

  const backToBook = () => navigate(`/businesses/${businessId}/cashbooks/${bookId}`);
  const businessName = currentBusiness?.name || 'Business';

  const handleMemberAdded = async (newMember) => {
    // Guard: prevent re-adding someone already in this book
    const alreadyIn = bookMembers.some(m => {
      if (newMember.user_id && m.user_id === newMember.user_id) return true;
      if (newMember.email  && m.email?.toLowerCase()  === newMember.email.toLowerCase())  return true;
      if (newMember.mobile && m.mobile                === newMember.mobile)                return true;
      return false;
    });
    if (alreadyIn) throw new Error('This member is already part of this cashbook.');

    const { member } = await api.members.add(businessId, bookId, {
      user_id: newMember.user_id || null,
      name: newMember.name,
      mobile: newMember.mobile || null,
      email: newMember.email || null,
      role: newMember.role,
    });
    const mapped = {
      id: member.id,
      user_id: member.user_id,
      name: member.name,
      mobile: member.mobile || '',
      email: member.email || '',
      role: member.role,
      isYou: false,
    };
    setBookMembers(prev => [...prev, mapped]);
    setAddedIds(prev => new Set([...prev, mapped.id]));
    setSuccessAdded({ ...mapped, totalCount: bookMembers.length + 1 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))', background: 'var(--white)' }}>

      {/* ── Header ── */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={backToBook} style={{ display: 'flex', alignItems: 'center', color: 'var(--gray-500)', cursor: 'pointer', border: 'none', background: 'none', padding: 4, borderRadius: 4 }}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Settings</span>
          <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>({book.name})</span>
        </div>
        {isPrimaryAdmin && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => setModal('rename')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'none', fontSize: 13, cursor: 'pointer', color: 'var(--blue)', fontWeight: 500 }}>
              <Pencil size={13} /> Rename Book
            </button>
            <button onClick={() => setModal('duplicate')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'none', fontSize: 13, cursor: 'pointer', color: 'var(--blue)', fontWeight: 500 }}>
              <Copy size={13} /> Duplicate Book
            </button>
            <button onClick={() => setModal('delete')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'none', fontSize: 13, cursor: 'pointer', color: '#DC2626', fontWeight: 500 }}>
              <Trash2 size={13} /> Delete Book
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ── Left nav ── */}
        <div style={{ width: 220, borderRight: '1px solid var(--gray-200)', background: 'var(--white)', padding: '8px 0', flexShrink: 0 }}>
          {[
            { key: 'members', label: 'Members', sub: 'Add, Change role, Remove' },
            { key: 'entry-field', label: 'Entry Field', sub: 'Party, Category, Payment mode & Custom Fields', badge: true },
            ...(isPrimaryAdmin ? [{ key: 'edit-role', label: 'Edit Data Operator Role', sub: 'Make changes in role as per your need' }] : []),
          ].map(({ key, label, sub, badge }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '12px 16px', cursor: 'pointer',
                background: activeTab === key ? '#EFF6FF' : 'transparent',
                borderLeft: `3px solid ${activeTab === key ? 'var(--blue)' : 'transparent'}`,
                borderBottom: '1px solid var(--gray-100)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: activeTab === key ? 'var(--blue)' : 'var(--gray-800)', marginBottom: 2 }}>
                {label}
                {badge && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Members tab */}
          {activeTab === 'members' && (
            <div style={{ maxWidth: 680 }}>
              {/* Add Members card */}
              {canManageBook && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid var(--gray-200)', borderRadius: 10, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>Add Members</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                      Manage your cashflow together with your business admins,<br />family or friends by adding them as members
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddPanel(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, marginLeft: 20 }}
                  >
                    <UserPlus size={15} /> Add member
                  </button>
                </div>
              )}

              {/* Member count + roles link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>Total Members ({bookMembers.length})</span>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--blue)', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer' }}>
                  View roles & permissions <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10 }}>Members in this book</div>

              {/* Members list */}
              <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
                {bookMembers.map((m, i) => {
                  const badgeStyle = ROLE_BADGE[m.role] || { bg: '#F3F4F6', color: '#374151' };
                  return (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < bookMembers.length - 1 ? '1px solid var(--gray-100)' : 'none', position: 'relative' }}>
                      {(() => { const ac = avatarColor(m.name); return (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: ac.color, flexShrink: 0 }}>
                          {m.name[0].toUpperCase()}
                        </div>
                      ); })()}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{m.isYou ? 'You' : m.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                          {m.mobile || m.email || ''}
                          {m.employee_id ? ` | ${m.employee_id}` : ''}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: badgeStyle.bg, color: badgeStyle.color }}>{m.role}</span>
                      {!m.isYou && (isPrimaryAdmin || (myBookRole === 'Book Admin' && m.role !== 'Primary Admin')) && (
                        <div ref={memberMenuId === m.id ? menuRef : null} style={{ position: 'relative' }}>
                          <button
                            onClick={() => setMemberMenuId(memberMenuId === m.id ? null : m.id)}
                            style={{ display: 'flex', padding: 4, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-400)', borderRadius: 4 }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {memberMenuId === m.id && (
                            <div style={{ position: 'absolute', right: 0, top: '100%', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 140, overflow: 'hidden' }}>
                              <button
                                onClick={() => { setChangeRoleTarget(m); setMemberMenuId(null); }}
                                style={{ width: '100%', padding: '11px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >Change Role</button>
                              <button
                                onClick={() => { setRemoveTarget(m); setMemberMenuId(null); }}
                                style={{ width: '100%', padding: '11px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', color: '#DC2626', borderTop: '1px solid var(--gray-100)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >Remove</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Edit Data Operator Role tab */}
          {activeTab === 'edit-role' && (
            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>Edit Data Operator Role</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Customize what Data Operators can do in this book</div>
              </div>
              <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
                {[
                  { label: 'Add Cash In / Cash Out entries', key: 'add_entries' },
                  { label: 'Edit entries (added by themselves)', key: 'edit_own' },
                  { label: 'Delete entries (added by themselves)', key: 'delete_own' },
                  { label: 'View entries by everyone', key: 'view_all' },
                  { label: 'View net balance', key: 'view_balance' },
                  { label: 'Download PDF or Excel', key: 'download' },
                ].map(({ label, key }, i, arr) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <span style={{ fontSize: 13, color: 'var(--gray-800)' }}>{label}</span>
                    <Toggle on={!!dataOpPerms[key]} onChange={(v) => setDataOpPerms(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Info size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: 'var(--gray-700)' }}>Changes here affect all Data Operators in this book. Book Admins and Primary Admin always have full access.</span>
              </div>
            </div>
          )}

          {/* Entry Field tab */}
          {activeTab === 'entry-field' && (
            <div>
              <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--gray-100)', marginBottom: 24 }}>
                {[['party', 'Party'], ['category', 'Category']].map(([k, label]) => (
                  <button key={k} onClick={() => setActiveSection(k)} style={{
                    padding: '8px 20px', border: 'none', background: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    color: activeSection === k ? 'var(--blue)' : 'var(--gray-500)',
                    borderBottom: `2px solid ${activeSection === k ? 'var(--blue)' : 'transparent'}`,
                    marginBottom: -2,
                  }}>
                    {label}
                    {k === 'category' && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#DBEAFE', color: 'var(--blue)' }}>NEW</span>}
                  </button>
                ))}
              </div>

              {activeSection === 'party' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Show field</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Show Party field in entry form</div>
                    </div>
                    <Toggle on={showParty} onChange={setShowParty} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 10 }}>Add New Party</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>
                        <Upload size={13} /> Import CSV <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: '#DBEAFE', color: 'var(--blue)' }}>NEW</span>
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>
                        <BookOpen size={13} /> Import From Books
                      </button>
                      <button onClick={() => setModal('add-party')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--blue)', background: 'var(--blue-light)', fontSize: 13, cursor: 'pointer', color: 'var(--blue)', fontWeight: 600 }}>
                        <Plus size={13} /> Add Manually
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Parties from this book ({parties.length})</div>
                    {parties.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)', background: 'var(--gray-50)', borderRadius: 8, border: '1px dashed var(--gray-200)' }}>
                        <div style={{ fontSize: 13 }}>No parties added yet</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>Add parties to link with transactions</div>
                      </div>
                    ) : (
                      <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
                        {parties.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < parties.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                            <span style={{ fontSize: 13 }}>{p}</span>
                            <button onClick={() => setParties((prev) => prev.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Trash2 size={13} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'category' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Show field</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Show Category field in entry form</div>
                    </div>
                    <Toggle on={showCategory} onChange={setShowCategory} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}>
                        Required field <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: '#DBEAFE', color: 'var(--blue)' }}>NEW</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Make Category mandatory for entries</div>
                    </div>
                    <Toggle on={categoryRequired} onChange={setCategoryRequired} />
                  </div>
                  {categories.length === 0 && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)', background: 'var(--gray-50)', borderRadius: 8, border: '1px dashed var(--gray-200)', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>No Categories Found</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Add categories to organise your entries</div>
                    </div>
                  )}
                  {categories.length > 0 && (
                    <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                      {categories.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < categories.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                          <span style={{ fontSize: 13 }}>{c}</span>
                          <button onClick={() => setCategories((prev) => prev.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal('add-category')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--blue)', background: 'var(--blue-light)', fontSize: 13, cursor: 'pointer', color: 'var(--blue)', fontWeight: 600 }}>
                      <Plus size={13} /> Add New Category
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--white)', fontSize: 13, cursor: 'pointer', color: 'var(--gray-700)' }}>
                      <BookOpen size={13} /> Import from other books
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals & panels ── */}
      {modal === 'rename' && <RenameModal bookName={book.name} onRename={(name) => renameCashbook(bookId, name)} onClose={() => setModal(null)} />}
      {modal === 'delete' && <DeleteBookModal bookName={book.name} onDelete={() => { deleteCashbook(bookId); navigate(`/businesses/${businessId}/cashbooks`); }} onClose={() => setModal(null)} />}
      {modal === 'duplicate' && <DuplicateBookModal book={book} onClose={() => setModal(null)} onDuplicate={addCashbook} />}
      {modal === 'add-party' && <AddPartyModal onAdd={(name) => setParties((prev) => [...prev, name])} onClose={() => setModal(null)} />}
      {modal === 'add-category' && <AddCategoryModal onAdd={(name) => setCategories((prev) => [...prev, name])} onClose={() => setModal(null)} />}

      {showAddPanel && (
        <AddMemberPanel
          businessName={businessName}
          bookName={book.name}
          bookMembers={bookMembers}
          businessTeam={businessTeam}
          onAddTeamMember={handleMemberAdded}
          onAddNew={() => { setShowAddPanel(false); setShowAddNewModal(true); }}
          onClose={() => setShowAddPanel(false)}
        />
      )}
      {showAddNewModal && (
        <AddNewMemberModal
          businessName={businessName}
          bookName={book.name}
          onAdd={handleMemberAdded}
          onClose={() => setShowAddNewModal(false)}
        />
      )}
      {changeRoleTarget && (
        <ChangeRolePanel
          member={changeRoleTarget}
          bookName={book.name}
          onUpdate={async (id, role) => {
            await api.members.updateRole(businessId, bookId, id, role);
            setBookMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
            setToast(`${changeRoleTarget.name} has been changed to ${role} in ${book.name}`);
            setChangeRoleTarget(null);
          }}
          onClose={() => setChangeRoleTarget(null)}
        />
      )}
      {removeTarget && (
        <RemoveMemberModal
          member={removeTarget}
          bookName={book.name}
          onConfirm={async () => {
            await api.members.remove(businessId, bookId, removeTarget.id);
            setBookMembers(prev => prev.filter(m => m.id !== removeTarget.id));
            setAddedIds(prev => { const s = new Set(prev); s.delete(removeTarget.id); return s; });
          }}
          onClose={() => setRemoveTarget(null)}
        />
      )}
      {successAdded && (
        <SuccessModal
          memberName={successAdded.name}
          role={successAdded.role}
          bookName={book.name}
          totalCount={successAdded.totalCount}
          onAddMore={() => { setSuccessAdded(null); setShowAddPanel(true); }}
          onClose={() => setSuccessAdded(null)}
        />
      )}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
