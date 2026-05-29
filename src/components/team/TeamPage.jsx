import { useState } from 'react';
import { ChevronRight, Plus, Download, Search, ChevronDown, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ROLE_COLORS = {
  PRIMARY_ADMIN: { bg: '#DCFCE7', color: '#15803D', label: 'Primary Admin' },
  ADMIN: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Admin' },
  MANAGER: { bg: '#FEF9C3', color: '#854D0E', label: 'Manager' },
  STAFF: { bg: '#F3F4F6', color: '#374151', label: 'Staff' },
};

const WALLET_COLORS = {
  NOT_ISSUED: { bg: '#F3F4F6', color: '#6B7280', label: 'Not Issued' },
  ACTIVE: { bg: '#DCFCE7', color: '#15803D', label: 'Active' },
  PAUSED: { bg: '#FEF9C3', color: '#854D0E', label: 'Paused' },
  INACTIVE: { bg: '#FEE2E2', color: '#DC2626', label: 'Inactive' },
};

function Badge({ config }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 12,
      fontSize: 11, fontWeight: 600,
      background: config.bg, color: config.color,
    }}>
      {config.label}
    </span>
  );
}

const INVITE_ROLES = [
  { key: 'ADMIN',    label: 'Admin',    desc: 'Almost full access' },
  { key: 'MANAGER',  label: 'Manager',  desc: 'Limited access, own team' },
  { key: 'STAFF',    label: 'Staff',    desc: 'Basic expense entry only' },
  { key: 'EMPLOYEE', label: 'Employee', desc: 'Expense entry only' },
];

function InviteModal({ onClose }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STAFF');

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

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480,
        background: '#fff',
        boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
        zIndex: 500,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid var(--gray-200)',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Invite Team Member</span>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 6,
              border: '1px solid var(--gray-200)',
              background: 'var(--white)', cursor: 'pointer',
              color: 'var(--gray-400)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Name <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 7,
                border: '1px solid var(--gray-300)',
                fontSize: 14, outline: 'none', color: '#111827',
              }}
            />
          </div>

          {/* Mobile Number */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Mobile Number <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', borderRadius: 7, border: '1px solid var(--gray-300)', overflow: 'hidden' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 12px',
                background: '#F3F4F6',
                borderRight: '1px solid var(--gray-300)',
                fontSize: 14, fontWeight: 600, color: '#374151',
                flexShrink: 0, userSelect: 'none',
              }}>
                +91
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                style={{
                  flex: 1, padding: '9px 12px',
                  border: 'none', outline: 'none',
                  fontSize: 14, color: '#111827',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Email <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 7,
                border: '1px solid var(--gray-300)',
                fontSize: 14, outline: 'none', color: '#111827',
              }}
            />
          </div>

          {/* Role — radio cards */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              Role
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INVITE_ROLES.map(({ key, label, desc }) => {
                const selected = role === key;
                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 8,
                      border: selected ? '1.5px solid var(--blue)' : '1.5px solid var(--gray-200)',
                      background: selected ? '#EFF6FF' : '#fff',
                      cursor: 'pointer',
                      transition: 'border-color 120ms, background 120ms',
                    }}
                  >
                    {/* Custom radio circle */}
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: selected ? '5px solid var(--blue)' : '2px solid var(--gray-300)',
                      background: '#fff',
                      boxSizing: 'border-box',
                      transition: 'border 120ms',
                    }} />
                    <input
                      type="radio"
                      name="invite-role"
                      value={key}
                      checked={selected}
                      onChange={() => setRole(key)}
                      style={{ display: 'none' }}
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          padding: '16px 28px',
          borderTop: '1px solid var(--gray-200)',
          flexShrink: 0,
          background: '#fff',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: 7,
              border: '1px solid var(--gray-300)',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', background: '#fff', color: '#374151',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: 7,
              background: 'var(--blue)', color: '#fff',
              fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer',
            }}
          >
            Send Invite
          </button>
        </div>
      </div>
    </>
  );
}

export default function TeamPage() {
  const { teamMembers } = useApp();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected] = useState([]);

  const filtered = teamMembers.filter((m) => {
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.mobile || '').includes(search) ||
      (m.employeeId || '').includes(search);
    const matchRole = !roleFilter || m.role === roleFilter;
    const matchWallet = !walletFilter || m.walletStatus === walletFilter;
    const matchTab = tab === 'all' || (tab === 'team' && m.reportsTo === null && m.isYou);
    return matchSearch && matchRole && matchWallet && matchTab;
  });

  const allSelected = filtered.length > 0 && selected.length === filtered.length;

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Team</h1>

      {/* Top 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
        {[
          {
            title: 'Invite your team',
            desc: 'Invite team members to CashBook, set their access, and send out invites.',
            onClick: () => setShowInvite(true),
          },
          {
            title: 'Member fields',
            desc: 'Manage employee ID, location, department and other fields.',
            badge: 'New',
          },
          {
            title: 'View roles & permissions',
            desc: 'See role based permissions and access in your organisation.',
          },
        ].map(({ title, desc, badge, onClick }) => (
          <div
            key={title}
            onClick={onClick}
            style={{
              border: '1px solid var(--gray-200)', borderRadius: 10,
              padding: '16px 18px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              transition: 'box-shadow 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
                {badge && (
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: 'var(--green)', color: 'var(--white)', fontSize: 10, fontWeight: 700 }}>
                    {badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{desc}</div>
            </div>
            <ChevronRight size={16} color="var(--gray-400)" style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--gray-200)', marginBottom: 16 }}>
        {[
          { key: 'all', label: `All Members (${teamMembers.length})` },
          { key: 'team', label: `Your Team (${teamMembers.filter((m) => m.isYou).length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 16px', fontSize: 13, fontWeight: tab === key ? 600 : 400,
              color: tab === key ? 'var(--blue)' : 'var(--gray-500)',
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: tab === key ? '2px solid var(--blue)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--gray-200)', borderRadius: 6, padding: '7px 12px',
          background: 'var(--white)',
        }}>
          <Search size={14} color="var(--gray-400)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, number, employee ID..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent' }}
          />
          <span style={{ color: 'var(--gray-300)', fontSize: 12 }}>/</span>
        </div>

        {[
          { label: 'Role', value: roleFilter, set: setRoleFilter, options: Object.entries(ROLE_COLORS).map(([k, v]) => ({ value: k, label: v.label })) },
          { label: 'Wallet Status', value: walletFilter, set: setWalletFilter, options: Object.entries(WALLET_COLORS).map(([k, v]) => ({ value: k, label: v.label })) },
        ].map(({ label, value, set, options }) => (
          <div key={label} style={{ position: 'relative' }}>
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              style={{
                appearance: 'none', padding: '7px 28px 7px 10px',
                border: '1px solid var(--gray-200)', borderRadius: 6,
                fontSize: 13, background: 'var(--white)', cursor: 'pointer',
                color: value ? 'var(--blue)' : 'var(--gray-700)', outline: 'none',
                fontWeight: value ? 600 : 400,
              }}
            >
              <option value="">{label}</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--gray-400)' }} />
          </div>
        ))}

        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '7px 12px', border: '1px dashed var(--gray-300)',
            borderRadius: 6, fontSize: 13, cursor: 'pointer',
            background: 'var(--white)', color: 'var(--gray-500)',
          }}
        >
          <Plus size={13} /> Add Filter
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', border: '1px solid var(--gray-200)',
            borderRadius: 6, fontSize: 13, cursor: 'pointer', background: 'var(--white)',
          }}>
            <Download size={13} /> Download
          </button>
          <button
            onClick={() => setShowInvite(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', background: 'var(--blue)', color: 'var(--white)',
              borderRadius: 6, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Invite Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              <th style={{ width: 40, padding: '10px 12px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => setSelected(e.target.checked ? filtered.map((m) => m.id) : [])}
                />
              </th>
              {['Name', 'Employee ID', 'Email', 'Mobile Number', 'Role', 'Reports To', 'Wallet Status'].map((h) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr
                key={member.id}
                style={{ borderBottom: '1px solid var(--gray-100)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(member.id)}
                    onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, member.id] : prev.filter((id) => id !== member.id))}
                  />
                </td>
                <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 600 }}>
                  {member.name}{member.isYou && <span style={{ color: 'var(--gray-400)', fontWeight: 400, fontSize: 12 }}> (You)</span>}
                </td>
                <td style={{ padding: '12px 12px', fontSize: 13 }}>
                  {member.employeeId
                    ? <span>{member.employeeId}</span>
                    : <span style={{ color: 'var(--blue)', cursor: 'pointer', fontSize: 12 }}>Add Employee ID</span>
                  }
                </td>
                <td style={{ padding: '12px 12px', fontSize: 13, color: 'var(--gray-500)' }}>{member.email || '—'}</td>
                <td style={{ padding: '12px 12px', fontSize: 13 }}>{member.mobile}</td>
                <td style={{ padding: '12px 12px' }}>
                  <Badge config={ROLE_COLORS[member.role] || ROLE_COLORS.STAFF} />
                </td>
                <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--gray-400)' }}>
                  {member.reportsTo || <span style={{ color: 'var(--gray-300)' }}>Assign Manager</span>}
                </td>
                <td style={{ padding: '12px 12px' }}>
                  <Badge config={WALLET_COLORS[member.walletStatus] || WALLET_COLORS.NOT_ISSUED} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderTop: '1px solid var(--gray-100)',
          fontSize: 12, color: 'var(--gray-500)',
        }}>
          <span>Showing 1-{filtered.length} of {filtered.length} members</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button disabled style={{ padding: '4px 8px', border: '1px solid var(--gray-200)', borderRadius: 4, cursor: 'not-allowed', opacity: 0.5, background: 'var(--white)' }}>‹</button>
            <span>1 of 1 pages</span>
            <button disabled style={{ padding: '4px 8px', border: '1px solid var(--gray-200)', borderRadius: 4, cursor: 'not-allowed', opacity: 0.5, background: 'var(--white)' }}>›</button>
            <select style={{ border: '1px solid var(--gray-200)', borderRadius: 4, padding: '3px 6px', fontSize: 12, background: 'var(--white)' }}>
              <option>25 members per page</option>
              <option>50 members per page</option>
            </select>
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
