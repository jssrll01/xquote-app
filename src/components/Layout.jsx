import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PlusCircle, LogOut,
  Download, Save,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Layout({
  children,
  onExport, onSave,
  showSave = false,
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { to: '/',         icon: LayoutDashboard, label: 'Home' },
    { to: '/new',      icon: PlusCircle,      label: 'New' },
    { to: '/history',  icon: FileText,        label: 'History' },
  ];

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const Btn = ({ icon: Icon, label, onClick, color = '#7A8499' }) => (
    <button onClick={onClick} className="neu-btn" title={label}
      style={{ padding: 10, borderRadius: 10 }}>
      <Icon size={16} style={{ color }} />
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#EEF1F6' }}>
      <header style={{
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        position: 'sticky', top: 0, zIndex: 30,
        background: '#EEF1F6',
        boxShadow: '0 6px 14px rgba(163, 177, 198, 0.35)',
      }}>
        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <div className="neu-card" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, flexShrink: 0 }}>
            <img src="/icons/icon-192.png" alt="XQuote" style={{ width: 22, height: 22, borderRadius: 5 }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>XQuote</div>
            <div className="muted" style={{ fontSize: 10 }}>Receipts</div>
          </div>
        </div>

        {/* action icons — only Save (on new), Export, Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {showSave && (
            <Btn icon={Save} label="Save" onClick={onSave} color="#8B5CF6" />
          )}
          <Btn icon={Download} label="Export" onClick={onExport} color="#7A8499" />
          <button onClick={handleSignOut} className="neu-btn" title="Logout"
            style={{ padding: 10, borderRadius: 10 }}>
            <LogOut size={16} style={{ color: '#DC2626' }} />
          </button>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: 90 }}>{children}</main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#EEF1F6',
        boxShadow: '0 -6px 14px rgba(163, 177, 198, 0.35)',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 16px', zIndex: 20,
      }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: isActive ? '#6366F1' : '#7A8499', fontSize: 10.5, fontWeight: 800,
              padding: '6px 16px', textDecoration: 'none', borderRadius: 12,
              background: isActive ? '#EEF1F6' : 'transparent',
              boxShadow: isActive
                ? '4px 4px 9px rgba(163, 177, 198, 0.55), -4px -4px 9px rgba(255, 255, 255, 0.95)'
                : 'none',
            })}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
