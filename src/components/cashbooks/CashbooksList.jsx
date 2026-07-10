import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search, SortAsc, Plus, Pencil, Copy, UserPlus, LogOut,
  X, Check, Users, Info, BookOpen, Mail, CreditCard, MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useWindowWidth } from '../../hooks/useWindowWidth';

const S = {
  page: { display: 'flex', minHeight: 'calc(100vh - var(--topbar-height))' },
  main: { flex: 1, padding: '22px 26px', minWidth: 0 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: '#111827' },
  roleBanner: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 16px',
    borderRadius: 6, fontSize: 14, marginBottom: 16,
  },
  controls: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
  },
  searchBox: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 8,
    border: '1px solid #E5E7EB', borderRadius: 6,
    padding: '9px 14px', background: '#fff',
  },
  sortBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '9px 16px', border: '1px solid #E5E7EB',
    borderRadius: 6, fontSize: 14, background: '#fff',
    color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap',
    fontWeight: 500,
  },
  bookCard: (hovered) => ({
    display: 'flex', alignItems: 'center',
    padding: '15px 18px',
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    marginBottom: 8,
    background: hovered ? '#F9FAFB' : '#fff',
    cursor: 'pointer',
    transition: 'background 150ms',
  }),
  bookIcon: {
    width: 44, height: 44, borderRadius: 9,
    background: '#2563EB', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16, flexShrink: 0,
  },
  bookName: { fontSize: 15, fontWeight: 600, color: '#111827' },
  bookMeta: { fontSize: 13, color: '#9CA3AF', marginTop: 3 },
  bookActions: {
    display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto',
  },
  actionIcon: () => ({
    width: 32, height: 32, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#9CA3AF',
    background: 'transparent',
    transition: 'all 150ms',
  }),
  badge: (count) => ({
    minWidth: 30, height: 24, borderRadius: 12,
    background: count > 0 ? '#DCFCE7' : '#F3F4F6',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
    color: count > 0 ? '#16A34A' : '#6B7280',
    padding: '0 8px', marginRight: 6,
  }),
  addCta: {
    border: '1.5px dashed #D1D5DB', borderRadius: 8,
    padding: '16px 18px', marginTop: 8, background: '#FAFAFA',
    cursor: 'pointer',
  },
  addCtaRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  quickTag: {
    display: 'inline-flex', alignItems: 'center',
    padding: '6px 16px', border: '1px solid #E5E7EB',
    borderRadius: 20, fontSize: 13, cursor: 'pointer',
    color: '#6B7280', background: '#fff',
    marginRight: 8, marginBottom: 4,
    transition: 'all 150ms',
  },
  sidebar: {
    width: 290, flexShrink: 0, padding: '20px 18px',
    borderLeft: '1px solid #F3F4F6',
  },
  addBookBtn: {
    width: '100%', padding: '13px', borderRadius: 8,
    background: '#2563EB', color: '#fff',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    marginBottom: 16, border: 'none',
  },
  sideWidget: {
    border: '1px solid #E5E7EB', borderRadius: 10,
    padding: '16px', marginBottom: 12,
  },
  widgetIcon: (bg) => ({
    width: 40, height: 40, borderRadius: 9,
    background: bg, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }),
  widgetTitle: { fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 },
  widgetDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: '1.5' },
  widgetBtn: {
    padding: '8px 18px', borderRadius: 6,
    border: '1.5px solid #2563EB', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', background: '#fff',
    color: '#2563EB',
  },
  widgetLink: {
    color: '#2563EB', fontSize: 13, fontWeight: 500, cursor: 'pointer',
    textDecoration: 'none',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: 24,
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
          <X size={18} style={{ cursor: 'pointer', color: '#9CA3AF' }} onClick={onClose} />
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
              padding: '10px 32px', borderRadius: 6,
              background: name.trim() && !saving ? '#2563EB' : '#9CA3AF',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: name.trim() && !saving ? 'pointer' : 'not-allowed', border: 'none',
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
          <X size={18} style={{ cursor: 'pointer', color: '#9CA3AF' }} onClick={onClose} />
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { onRename(book.id, name.trim()); onClose(); } }}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 6,
            border: '1px solid #D1D5DB', fontSize: 14,
            outline: 'none', marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: 6, border: '1px solid #D1D5DB',
            fontSize: 13, cursor: 'pointer', background: '#fff',
          }}>Cancel</button>
          <button
            onClick={() => { if (name.trim()) { onRename(book.id, name.trim()); onClose(); } }}
            style={{
              padding: '8px 16px', borderRadius: 6, background: '#2563EB',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
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
      <div style={{ background: '#fff', borderRadius: 12, width: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Duplicate {book.name}</span>
          <X size={18} style={{ cursor: 'pointer', color: '#9CA3AF' }} onClick={onClose} />
        </div>
        <div style={{ padding: '10px 20px', background: '#EFF6FF', borderBottom: '1px solid #DBEAFE', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={14} color="#2563EB" />
          <span style={{ fontSize: 13, color: '#374151' }}>Create new book with same settings as {book.name}</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              Step 1 : <span style={{ color: '#2563EB' }}>Choose New Book Name</span>
            </div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
              Enter new book name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter new book name"
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #2563EB', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
              Step 2 : <span style={{ color: '#2563EB' }}>Choose settings to duplicate</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, border: '1px solid #E5E7EB', cursor: 'pointer', background: settings[key] ? '#F8FAFF' : '#fff' }}>
                  <input type="checkbox" checked={settings[key]} onChange={() => setSettings((p) => ({ ...p, [key]: !p[key] }))} style={{ accentColor: '#2563EB', width: 16, height: 16, cursor: 'pointer' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px', borderTop: '1px solid #F3F4F6', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#374151' }}>
            <X size={13} /> Cancel
          </button>
          <button
            disabled={!name.trim() || saving}
            onClick={async () => { if (!name.trim() || saving) return; setSaving(true); try { await onDuplicate(name.trim()); onClose(); } catch (err) { alert(err.message); } finally { setSaving(false); } }}
            style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: name.trim() ? '#2563EB' : '#E5E7EB', color: name.trim() ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 600, cursor: name.trim() ? 'pointer' : 'not-allowed' }}
          >
            {saving ? 'Creating...' : 'Add New Book'}
          </button>
        </div>
      </div>
    </div>
  );
}

const QUICK_BOOKS = ['June Expenses', 'Staff Salary', 'Cash Journal', 'Purchase order Book'];

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
  const windowWidth = useWindowWidth();
  const isTablet = windowWidth <= 1024;
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h1 style={S.pageTitle}>{currentBusiness?.name || 'Cashbooks'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Show Add New Book inline on tablet (right sidebar hidden) */}
            {isTablet && isPrimaryAdmin && (
              <button
                style={{ ...S.addBookBtn, marginBottom: 0, width: 'auto', padding: '9px 18px' }}
                onClick={() => { setPrefilledName(''); setShowAdd(true); }}
              >
                <Plus size={15} />
                Add New Book
              </button>
            )}
            <div
              onClick={() => navigate(`/businesses/${businessId}/team`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                padding: '7px 14px', borderRadius: 6, border: '1px solid #BFDBFE',
                background: '#EFF6FF',
              }}
            >
              <Users size={15} />
              Business Team
            </div>
          </div>
        </div>

        {/* Role Banner */}
        <div style={{
          ...S.roleBanner,
          background: isPrimaryAdmin ? '#F0FDF4' : '#EFF6FF',
          border: `1px solid ${isPrimaryAdmin ? '#BBF7D0' : '#BFDBFE'}`,
        }}>
          <Info size={14} color={isPrimaryAdmin ? '#16A34A' : '#2563EB'} />
          <span style={{ fontSize: 13, color: '#374151' }}>
            Your Role: <strong>{currentBusiness?.my_role || 'Primary Admin'}</strong>
          </span>
          <span style={{ color: '#2563EB', cursor: 'pointer', marginLeft: 4, fontSize: 13 }}>View</span>
        </div>

        {/* Notification banners */}
        {visibleNotifs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: visibleNotifs.length > 1 ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 14 }}>
            {visibleNotifs.map((notif) => (
              <div key={notif.id} style={{
                border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '12px 14px', background: '#fff',
                display: 'flex', alignItems: 'flex-start', gap: 10,
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
                  <span style={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0, cursor: 'pointer', lineHeight: 1 }}>›</span>
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
            <Search size={14} color="#9CA3AF" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book name..."
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent', color: '#374151' }}
            />
            <span style={{ color: '#D1D5DB', fontSize: 11, fontWeight: 500, background: '#F3F4F6', padding: '1px 6px', borderRadius: 4 }}>/</span>
          </div>
          <button style={S.sortBtn}>
            <SortAsc size={14} color="#9CA3AF" />
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
              <BookOpen size={20} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={S.bookName}>{book.name}</div>
              <div style={S.bookMeta}>
                {(book.memberCount || 0) > 1 ? `${book.memberCount} members • ` : ''}
                Updated {timeAgo(book.updated_at || book.created_at || book.createdAt)}
              </div>
            </div>
            <div style={S.bookActions} onClick={(e) => e.stopPropagation()}>
              <div style={S.badge(book.transactionCount || 0)}>{book.transactionCount || 0}</div>
              {isPrimaryAdmin && (
                <>
                  <div
                    style={S.actionIcon()}
                    title="Rename"
                    onClick={() => setRenameBook(book)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Pencil size={14} />
                  </div>
                  <div
                    style={S.actionIcon()}
                    title="Duplicate"
                    onClick={() => setDuplicateBook(book)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Copy size={14} />
                  </div>
                </>
              )}
              <div
                style={S.actionIcon()}
                title="Book Members"
                onClick={() => navigate(`/businesses/${businessId}/cashbooks/${book.id}/settings`)}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
              >
                <UserPlus size={14} />
              </div>
              {isPrimaryAdmin && (
                <div
                  style={S.actionIcon()}
                  title="Export"
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogOut size={14} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Book CTA */}
        {isPrimaryAdmin && (
          <div style={S.addCta} onClick={() => { setPrefilledName(''); setShowAdd(true); }}>
            <div style={S.addCtaRow}>
              <div style={{ width: 44, height: 44, borderRadius: 9, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={20} color="#7C3AED" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Add New Book</div>
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Click to quickly add books for</div>
              </div>
            </div>
            <div>
              {QUICK_BOOKS.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...S.quickTag,
                    background: hoveredTag === tag ? '#EFF6FF' : '#fff',
                    borderColor: hoveredTag === tag ? '#93C5FD' : '#E5E7EB',
                    color: hoveredTag === tag ? '#2563EB' : '#6B7280',
                  }}
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                  onClick={(e) => { e.stopPropagation(); setPrefilledName(tag); setShowAdd(true); }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar — hidden on tablet */}
      <div style={{ ...S.sidebar, display: isTablet ? 'none' : undefined }}>
        {isPrimaryAdmin && (
          <button style={S.addBookBtn} onClick={() => { setPrefilledName(''); setShowAdd(true); }}>
            <Plus size={15} />
            + Add New Book
          </button>
        )}

        {/* Login via Email ID */}
        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={S.widgetIcon('#DCFCE7')}>
              <Mail size={18} color="#16A34A" />
            </div>
            <div>
              <div style={S.widgetTitle}>Login via Email ID</div>
              <div style={S.widgetDesc}>Verify email to login to desktop</div>
            </div>
          </div>
          <button style={S.widgetBtn}>Add Email</button>
        </div>

        {/* Tried Passbook */}
        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={S.widgetIcon('#EFF6FF')}>
              <CreditCard size={18} color="#2563EB" />
            </div>
            <div>
              <div style={S.widgetTitle}>Tried Passbook?</div>
              <div style={S.widgetDesc}>Automatically get all online transactions at one place.</div>
            </div>
          </div>
          <a style={S.widgetLink}>Know More &gt;</a>
        </div>

        {/* Need help */}
        <div style={S.sideWidget}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={S.widgetIcon('#DCFCE7')}>
              <MessageCircle size={18} color="#16A34A" />
            </div>
            <div>
              <div style={S.widgetTitle}>Need help in business setup?</div>
              <div style={S.widgetDesc}>Our support team will help you</div>
            </div>
          </div>
          <a style={S.widgetLink}>Contact Us &gt;</a>
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
