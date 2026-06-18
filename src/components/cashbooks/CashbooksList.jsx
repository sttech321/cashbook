import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search, SortAsc, Plus, Pencil, Copy, UserPlus, LogOut,
  X, Check, Users, Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const S = {
  page: { display: 'flex', minHeight: 'calc(100vh - var(--topbar-height))' },
  main: { flex: 1, padding: 24, minWidth: 0 },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  pageTitle: { fontSize: 20, fontWeight: 700 },
  roleBanner: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 14px', background: '#EFF6FF',
    borderRadius: 6, fontSize: 13, marginBottom: 16,
    border: '1px solid #BFDBFE',
  },
  controls: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
  },
  searchBox: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 8,
    border: '1px solid var(--gray-200)', borderRadius: 6,
    padding: '7px 12px', background: 'var(--white)',
  },
  sortBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 12px', border: '1px solid var(--gray-200)',
    borderRadius: 6, fontSize: 13, background: 'var(--white)',
    color: 'var(--gray-600)', cursor: 'pointer',
  },
  bookCard: (hovered) => ({
    display: 'flex', alignItems: 'center',
    padding: '14px 16px',
    borderRadius: 8,
    border: '1px solid var(--gray-200)',
    marginBottom: 8,
    background: hovered ? 'var(--gray-50)' : 'var(--white)',
    cursor: 'pointer',
    transition: 'background 150ms',
  }),
  bookIcon: {
    width: 38, height: 38, borderRadius: 8,
    background: '#EFF6FF', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, flexShrink: 0,
  },
  bookName: { fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' },
  bookMeta: { fontSize: 12, color: 'var(--gray-400)', marginTop: 2 },
  bookActions: {
    display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto',
  },
  actionIcon: (active) => ({
    width: 30, height: 30, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: active ? 'var(--blue)' : 'var(--gray-400)',
    background: active ? 'var(--blue-light)' : 'transparent',
    transition: 'all 150ms',
  }),
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    background: 'var(--gray-100)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 600, color: 'var(--gray-600)',
    padding: '0 5px',
  },
  addCta: {
    border: '1.5px dashed var(--gray-300)', borderRadius: 8,
    padding: '16px', marginTop: 8, background: 'var(--gray-50)',
    cursor: 'pointer',
  },
  addCtaRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  quickTag: {
    display: 'inline-flex', alignItems: 'center',
    padding: '4px 12px', border: '1px solid var(--gray-300)',
    borderRadius: 20, fontSize: 12, cursor: 'pointer',
    color: 'var(--gray-600)', background: 'var(--white)',
    marginRight: 6, marginBottom: 4,
    transition: 'all 150ms',
  },
  sidebar: {
    width: 280, flexShrink: 0, padding: '24px 16px',
    borderLeft: '1px solid var(--gray-200)',
  },
  addBookBtn: {
    width: '100%', padding: '10px', borderRadius: 8,
    background: 'var(--blue)', color: 'var(--white)',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginBottom: 14, border: 'none',
  },
  sideWidget: {
    border: '1px solid var(--gray-200)', borderRadius: 10,
    padding: '14px', marginBottom: 12,
  },
  widgetTitle: { fontSize: 13, fontWeight: 600, marginBottom: 4 },
  widgetDesc: { fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 },
  widgetBtn: {
    padding: '6px 14px', borderRadius: 6,
    border: '1px solid var(--gray-300)', fontSize: 12,
    fontWeight: 500, cursor: 'pointer', background: 'var(--white)',
  },
  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
  },
  modal: {
    background: 'var(--white)', borderRadius: 12, padding: 24,
    minWidth: 380, boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function AddBookModal({ onClose, onAdd, initialName = '' }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try { await onAdd(name.trim()); onClose(); }
    catch (err) { alert('Failed to create book: ' + err.message); }
    finally { setSaving(false); }
  };
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, minWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Add New Book</h3>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
          Book Name
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter book name"
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 6,
            border: '1.5px solid #2563EB', fontSize: 14,
            outline: 'none', marginBottom: 28, boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={save}
            disabled={!name.trim() || saving}
            style={{
              padding: '10px 32px', borderRadius: 6, background: name.trim() && !saving ? 'var(--blue)' : '#9CA3AF',
              color: 'var(--white)', fontSize: 14, fontWeight: 700, cursor: name.trim() && !saving ? 'pointer' : 'not-allowed', border: 'none',
            }}
          >{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

function RenameModal({ book, onClose, onRename }) {
  const [name, setName] = useState(book.name);
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Rename Book</h3>
          <X size={18} style={{ cursor: 'pointer', color: 'var(--gray-400)' }} onClick={onClose} />
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onRename(book.id, name.trim()); onClose(); } }}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 6,
            border: '1px solid var(--gray-300)', fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: 6, border: '1px solid var(--gray-300)',
            fontSize: 13, cursor: 'pointer', background: 'var(--white)',
          }}>Cancel</button>
          <button
            onClick={() => { if (name.trim()) { onRename(book.id, name.trim()); onClose(); } }}
            style={{
              padding: '8px 16px', borderRadius: 6, background: 'var(--blue)',
              color: 'var(--white)', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
            }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}

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

const QUICK_BOOKS = ['May Expenses', 'Client Record', 'Staff Salary', 'Cash Journal', 'Payable Book', 'Business Records'];

const NOTIFICATIONS = [
  {
    id: 'book-admin-rename',
    icon: '💡',
    title: "Admin is now 'Book Admin'",
    desc: "We've renamed the role to make bookkeeping permissions easier to understand.",
  },
  {
    id: 'new-roles',
    icon: null,
    title: 'New Roles for Better Team Management',
    desc: "We've updated our role names and introduced a dedicated Manager role to help your business scale",
    hasArrow: true,
  },
];

export default function CashbooksList() {
  const { cashbooks, addCashbook, renameCashbook, currentBusiness } = useApp();
  const { businessId } = useParams();
  const isPrimaryAdmin = !currentBusiness?.my_role || currentBusiness?.my_role === 'Primary Admin';
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [prefilledName, setPrefilledName] = useState('');
  const [renameBook, setRenameBook] = useState(null);
  const [duplicateBook, setDuplicateBook] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [dismissedNotifs, setDismissedNotifs] = useState([]);

  const filtered = cashbooks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  const visibleNotifs = NOTIFICATIONS.filter((n) => !dismissedNotifs.includes(n.id));

  return (
    <div style={S.page}>
      <div style={S.main}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{currentBusiness?.name || 'Cashbooks'}</h1>
          <div
            onClick={() => navigate(`/businesses/${businessId}/team`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 6, border: '1px solid #BFDBFE',
              background: '#EFF6FF',
            }}
          >
            <Users size={14} />
            Business Team
          </div>
        </div>

        {/* Role Banner */}
        <div style={{
          ...S.roleBanner,
          background: isPrimaryAdmin ? '#F0FDF4' : '#EFF6FF',
          border: `1px solid ${isPrimaryAdmin ? '#BBF7D0' : '#BFDBFE'}`,
        }}>
          <span style={{ fontSize: 14 }}>ℹ️</span>
          <span>Your Role: <strong>{currentBusiness?.my_role || 'Primary Admin'}</strong></span>
          <span style={{ color: 'var(--blue)', cursor: 'pointer', marginLeft: 4 }}>View</span>
        </div>

        {/* Notification banners */}
        {visibleNotifs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: visibleNotifs.length > 1 ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 14 }}>
            {visibleNotifs.map((notif) => (
              <div key={notif.id} style={{
                border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '12px 14px', background: 'white',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                position: 'relative',
              }}>
                {notif.icon && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                    {notif.icon}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{notif.title}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{notif.desc}</div>
                </div>
                {notif.hasArrow ? (
                  <span style={{ fontSize: 14, color: '#9CA3AF', flexShrink: 0, cursor: 'pointer' }}>›</span>
                ) : (
                  <X
                    size={14}
                    style={{ cursor: 'pointer', color: '#9CA3AF', flexShrink: 0 }}
                    onClick={() => setDismissedNotifs((prev) => [...prev, notif.id])}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={S.controls}>
          <div style={S.searchBox}>
            <Search size={15} color="var(--gray-400)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book name..."
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent' }}
            />
            <span style={{ color: 'var(--gray-300)', fontSize: 12 }}>/</span>
          </div>
          <button style={S.sortBtn}>
            <SortAsc size={14} />
            Sort By: Last Updated
          </button>
        </div>

        {/* Book list */}
        {filtered.map((book) => (
          <div
            key={book.id}
            style={S.bookCard(hoveredId === book.id)}
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => navigate(`/businesses/${businessId}/cashbooks/${book.id}`)}
          >
            <div style={S.bookIcon}>
              <span style={{ fontSize: 18, color: 'var(--blue)' }}>📒</span>
            </div>
            <div>
              <div style={S.bookName}>{book.name}</div>
              <div style={S.bookMeta}>
                {(book.memberCount || 0) > 1 ? `${book.memberCount} members • ` : ''}
                Updated {timeAgo(book.updated_at || book.created_at || book.createdAt)}
              </div>
            </div>
            <div style={S.bookActions} onClick={(e) => e.stopPropagation()}>
              <div style={S.badge}>{book.transactionCount}</div>
              {isPrimaryAdmin && (
                <>
                  <div
                    style={S.actionIcon(false)}
                    title="Rename"
                    onClick={() => setRenameBook(book)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Pencil size={14} />
                  </div>
                  <div
                    style={S.actionIcon(false)}
                    title="Duplicate"
                    onClick={() => setDuplicateBook(book)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Copy size={14} />
                  </div>
                </>
              )}
              <div
                style={S.actionIcon(false)}
                title="Book Members"
                onClick={() => navigate(`/businesses/${businessId}/cashbooks/${book.id}/settings`)}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <UserPlus size={14} />
              </div>
              {isPrimaryAdmin && (
                <div
                  style={S.actionIcon(false)}
                  title="Export"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-400)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogOut size={14} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Book CTA — Primary Admin only */}
        {isPrimaryAdmin && <div style={S.addCta} onClick={() => { setPrefilledName(''); setShowAdd(true); }}>
          <div style={S.addCtaRow}>
            <div style={{ ...S.bookIcon, background: '#E0E7FF' }}>
              <span style={{ fontSize: 18 }}>📗</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>Add New Book</div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Click to quickly add books for</div>
            </div>
          </div>
          <div>
            {QUICK_BOOKS.map((tag) => (
              <span
                key={tag}
                style={{
                  ...S.quickTag,
                  background: hoveredTag === tag ? 'var(--blue-light)' : 'var(--white)',
                  borderColor: hoveredTag === tag ? 'var(--blue)' : 'var(--gray-300)',
                  color: hoveredTag === tag ? 'var(--blue)' : 'var(--gray-600)',
                }}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag(null)}
                onClick={(e) => { e.stopPropagation(); setPrefilledName(tag); setShowAdd(true); }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>}
      </div>

      {/* Right Sidebar */}
      <div style={S.sidebar}>
        {isPrimaryAdmin && (
          <button style={S.addBookBtn} onClick={() => { setPrefilledName(''); setShowAdd(true); }}>
            <Plus size={15} />
            Add New Book
          </button>
        )}

        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>➕</span>
            </div>
            <div>
              <div style={S.widgetTitle}>Login via Email ID</div>
              <div style={S.widgetDesc}>Verify email to login to desktop</div>
            </div>
          </div>
          <button style={S.widgetBtn}>Add Email</button>
        </div>

        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>🏦</span>
            </div>
            <div>
              <div style={S.widgetTitle}>Tried Passbook?</div>
              <div style={S.widgetDesc}>Automatically get all online transactions at one place.</div>
            </div>
          </div>
          <a style={{ color: 'var(--blue)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Know More &gt;
          </a>
        </div>

        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>💬</span>
            </div>
            <div>
              <div style={S.widgetTitle}>Need help in business setup?</div>
              <div style={S.widgetDesc}>Our support team will help you</div>
            </div>
          </div>
          <a style={{ color: 'var(--blue)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Contact Us &gt;
          </a>
        </div>
      </div>

      {showAdd && (
        <AddBookModal
          onClose={() => { setShowAdd(false); setPrefilledName(''); }}
          onAdd={addCashbook}
          initialName={prefilledName}
        />
      )}
      {renameBook && (
        <RenameModal
          book={renameBook}
          onClose={() => setRenameBook(null)}
          onRename={renameCashbook}
        />
      )}
      {duplicateBook && (
        <DuplicateBookModal
          book={duplicateBook}
          onClose={() => setDuplicateBook(null)}
          onDuplicate={addCashbook}
        />
      )}
    </div>
  );
}
