import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, Settings, Sparkles,
  HelpCircle, Phone, ChevronDown, Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    minWidth: 'var(--sidebar-width)',
    height: '100%',
    background: 'var(--white)',
    borderRight: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'fixed',
    top: 'var(--topbar-height)',
    left: 0,
    bottom: 0,
  },
  scroll: {
    overflowY: 'auto',
    flex: 1,
    padding: '8px 0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--gray-500)',
    textTransform: 'none',
    letterSpacing: 0,
    cursor: 'pointer',
    userSelect: 'none',
    marginTop: 4,
  },
  item: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 12px',
    borderRadius: 6,
    margin: '1px 6px',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--white)' : 'var(--gray-700)',
    background: active ? 'var(--blue)' : 'transparent',
    cursor: 'pointer',
    transition: 'background 150ms, color 150ms',
  }),
};

function SectionHeader({ label, collapsed, onToggle }) {
  return (
    <div style={styles.sectionHeader} onClick={onToggle}>
      <span>{label}</span>
      <ChevronDown
        size={14}
        style={{ transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 200ms' }}
      />
    </div>
  );
}

function NavItem({ icon: Icon, label, path, active, onClick }) {
  return (
    <div
      style={styles.item(active)}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'var(--gray-100)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <Icon size={15} />
      <span>{label}</span>
    </div>
  );
}

export default function Sidebar() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBusiness } = useApp();
  const isPrimaryAdmin = !currentBusiness?.my_role || currentBusiness?.my_role === 'Primary Admin';
  const [collapsed, setCollapsed] = useState({
    upi: false,
    bookkeeping: false,
    settings: false,
    others: false,
  });

  const bid = businessId || 'RBqoxzP4MUS0r4Co8sGW';
  const path = location.pathname;

  const go = (route) => navigate(route);
  const toggle = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const is = (segment) => path.includes(segment);

  return (
    <nav style={styles.sidebar}>
      <div style={styles.scroll}>
        {/* CashBook UPI */}
        <SectionHeader
          label="CashBook UPI"
          collapsed={collapsed.upi}
          onToggle={() => toggle('upi')}
        />
        {!collapsed.upi && (
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={is('/payments')}
            onClick={() => go(`/businesses/${bid}/payments/dashboard`)}
          />
        )}

        {/* Book Keeping */}
        <SectionHeader
          label="Book Keeping"
          collapsed={collapsed.bookkeeping}
          onToggle={() => toggle('bookkeeping')}
        />
        {!collapsed.bookkeeping && (
          <NavItem
            icon={BookOpen}
            label="Cashbooks"
            active={is('/cashbooks')}
            onClick={() => go(`/businesses/${bid}/cashbooks`)}
          />
        )}

        {/* Settings */}
        <SectionHeader
          label="Settings"
          collapsed={collapsed.settings}
          onToggle={() => toggle('settings')}
        />
        {!collapsed.settings && (
          <>
            {isPrimaryAdmin && (
              <NavItem
                icon={Users}
                label="Team"
                active={is('/team')}
                onClick={() => go(`/businesses/${bid}/team`)}
              />
            )}
            <NavItem
              icon={Settings}
              label="Business Settings"
              active={is('/settings')}
              onClick={() => go(`/businesses/${bid}/settings`)}
            />
          </>
        )}

        {/* Others */}
        <SectionHeader
          label="Others"
          collapsed={collapsed.others}
          onToggle={() => toggle('others')}
        />
        {!collapsed.others && (
          <>
            <NavItem
              icon={Sparkles}
              label="What's New"
              active={is('/whats-new')}
              onClick={() => go(`/businesses/${bid}/whats-new`)}
            />
            <NavItem
              icon={HelpCircle}
              label="Help Docs"
              active={false}
              onClick={() => window.open('https://help.cashbook.in', '_blank')}
            />
            <NavItem
              icon={Phone}
              label="Contact Us"
              active={false}
              onClick={() => {}}
            />
          </>
        )}
      </div>
    </nav>
  );
}
