import React, { useEffect, useRef, useState } from 'react';
import { 
  LayoutDashboard, Users, FileBarChart, BrainCircuit, 
  ListChecks, Heart, Star, BarChart2, Activity, 
  ShieldCheck, Settings, LogOut, Menu, Bell, Search, Database,
  ChevronDown, Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BrandIcon from '../BrandIcon';
import { fetchDatabaseStatus } from '../../lib/api';

let cachedDatabaseStatus = null;

const AdminSidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}
    >
      <Icon className={`sidebar-nav-icon ${active ? 'sidebar-nav-icon-active' : ''}`} />
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState(cachedDatabaseStatus || { connected: false, status: 'checking' });
  const [statusLoading, setStatusLoading] = useState(!cachedDatabaseStatus);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  const mainNav = [
    { label: "Overview", to: "/admin/overview", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Assessments", to: "/admin/assessments", icon: FileBarChart },
    { label: "AI Modules", to: "/admin/ai-modules", icon: BrainCircuit },
  ];

  const contentNav = [
    { label: "Questionnaires", to: "/admin/questionnaires", icon: ListChecks },
    { label: "Wellness Content", to: "/admin/content", icon: Heart },
    { label: "Recommendations", to: "/admin/recommendations", icon: Star },
  ];

  const systemNav = [
    { label: "Reports", to: "/admin/reports", icon: BarChart2 },
    { label: "System Logs", to: "/admin/logs", icon: Activity },
    { label: "Admin Management", to: "/admin/management", icon: ShieldCheck },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  const profileMenuItems = [
    { label: "Admin Profile", to: "/admin/profile", icon: Users },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadDatabaseStatus() {
      if (cachedDatabaseStatus) {
        setDatabaseStatus(cachedDatabaseStatus);
        setStatusLoading(false);
        return;
      }

      try {
        const nextDatabaseStatus = await fetchDatabaseStatus();
        cachedDatabaseStatus = nextDatabaseStatus;
        if (!cancelled) {
          setDatabaseStatus(nextDatabaseStatus);
        }
      } catch {
        cachedDatabaseStatus = { connected: false, status: 'disconnected' };
        if (!cancelled) {
          setDatabaseStatus(cachedDatabaseStatus);
        }
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    }

    loadDatabaseStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;

    function handleClickOutside(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const isDatabaseConnected = Boolean(databaseStatus.connected);
  const databaseStatusLabel = statusLoading
    ? 'Checking…'
    : isDatabaseConnected
      ? 'Connected'
      : 'Disconnected';

  return (
    <div className="admin-root">
      <style>{`
        /* ─── Reset & Base ─── */
        .admin-root {
          min-height: 100vh;
          background: #f4f6fa;
          font-family: 'Inter', system-ui, sans-serif;
          color: #1e293b;
          padding-left: 260px;
        }
        @media (max-width: 1279px) { .admin-root { padding-left: 0; } }

        /* ─── Sidebar ─── */
        .admin-sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; z-index: 50;
          width: 260px; height: 100dvh;
          background: #fff;
          border-right: 1px solid #eaecf0;
          display: flex; flex-direction: column;
          box-shadow: 4px 0 20px rgba(15,23,42,.04);
          transition: transform .28s cubic-bezier(.4,0,.2,1);
        }
        .admin-sidebar-hidden { transform: translateX(-100%); }
        @media (min-width: 1280px) { .admin-sidebar { transform: translateX(0) !important; } }

        /* Logo */
        .sidebar-logo {
          height: 60px; display: flex; align-items: center;
          padding: 0 18px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
        }
        .sidebar-logo-link {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; min-width: 0;
        }
        .sidebar-logo-name { font-size: 17px; font-weight: 900; color: #0f172a; display: block; }
        .sidebar-logo-tag { font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: #6366f1; display: block; }

        /* Nav */
        .sidebar-nav { flex: 1; overflow-y: auto; padding: 20px 12px; display: flex; flex-direction: column; gap: 28px; }
        .sidebar-section { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-group-label {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          letter-spacing: .09em; color: #b0b8c8; padding: 0 10px;
          margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
        }
        .sidebar-group-label::after {
          content: ''; flex: 1; height: 1px; background: #f1f5f9;
        }

        /* Nav items */
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; border-radius: 9px;
          font-size: 13px; font-weight: 600; color: #64748b;
          text-decoration: none; transition: all .14s;
        }
        .sidebar-nav-item:hover { background: #f8fafc; color: #334155; }
        .sidebar-nav-item-active {
          background: #eef2ff; color: #4f46e5;
          font-weight: 700;
        }
        .sidebar-nav-item-active:hover { background: #e0e7ff; color: #4338ca; }
        .sidebar-nav-icon { width: 16px; height: 16px; color: #94a3b8; flex-shrink: 0; }
        .sidebar-nav-icon-active { color: #6366f1; }

        /* DB status - compact */
        .sidebar-bottom {
          flex-shrink: 0; border-top: 1px solid #f1f5f9;
          padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;
          background: #fafbfc;
        }
        .db-status-row {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 9px;
          background: #fff; border: 1px solid #f1f5f9;
        }
        .db-status-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .db-dot-ok { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.15); }
        .db-dot-err { background: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.15); }
        .db-status-text { font-size: 11.5px; font-weight: 600; color: #64748b; flex: 1; }
        .db-status-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #b0b8c8; }

        /* Profile button */
        .sidebar-profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 10px;
          border: 1px solid #eaecf0; background: #fff;
          cursor: pointer; text-align: left; width: 100%;
          transition: all .14s;
        }
        .sidebar-profile-btn:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,.08); }
        .sidebar-avatar {
          width: 34px; height: 34px; border-radius: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800; flex-shrink: 0;
        }
        .sidebar-profile-name { font-size: 13px; font-weight: 700; color: #1e293b; display: block; }
        .sidebar-profile-role { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #94a3b8; display: block; margin-top: 1px; }
        .sidebar-profile-chevron { color: #b0b8c8; margin-left: auto; }

        /* Profile dropdown */
        .sidebar-profile-menu {
          position: absolute; bottom: 100%; left: 14px; right: 14px; margin-bottom: 6px;
          background: #fff; border: 1px solid #eaecf0; border-radius: 12px;
          box-shadow: 0 -8px 30px rgba(15,23,42,.10); overflow: hidden;
          transition: opacity .15s, transform .15s;
          transform-origin: bottom;
        }
        .sidebar-profile-menu-visible { opacity: 1; transform: scaleY(1); pointer-events: all; }
        .sidebar-profile-menu-hidden { opacity: 0; transform: scaleY(.95); pointer-events: none; }
        .sidebar-menu-item {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 14px; font-size: 13px; font-weight: 600;
          color: #475569; text-decoration: none; transition: background .1s;
        }
        .sidebar-menu-item:hover { background: #f8fafc; color: #1e293b; }
        .sidebar-menu-item-danger { color: #dc2626; }
        .sidebar-menu-item-danger:hover { background: #fff5f5; color: #b91c1c; }
        .sidebar-menu-divider { height: 1px; background: #f1f5f9; }

        /* ─── Topbar ─── */
        .admin-topbar {
          height: 60px; background: #fff;
          border-bottom: 1px solid #eaecf0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px 0 24px; position: sticky; top: 0; z-index: 30;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .topbar-menu-btn {
          display: none; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid #eaecf0; background: #fff; color: #64748b; cursor: pointer;
        }
        @media (max-width: 1279px) { .topbar-menu-btn { display: flex; } }
        .topbar-search-wrap { position: relative; display: flex; align-items: center; }
        @media (max-width: 767px) { .topbar-search-wrap { display: none; } }
        .topbar-search-icon { position: absolute; left: 11px; color: #94a3b8; pointer-events: none; }
        .topbar-search {
          padding: 7px 14px 7px 34px; font-size: 13px; width: 280px;
          background: #f4f6fa; border: 1px solid transparent; border-radius: 10px;
          color: #334155; outline: none; transition: all .15s;
        }
        .topbar-search:focus { background: #fff; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); width: 340px; }

        .topbar-right { display: flex; align-items: center; gap: 6px; }

        /* Notification bell */
        .topbar-icon-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid #eaecf0; background: #fff; color: #64748b; cursor: pointer;
          transition: all .14s;
        }
        .topbar-icon-btn:hover { background: #f8fafc; color: #334155; border-color: #d1d5db; }
        .topbar-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #ef4444; border: 2px solid #fff;
        }

        /* Admin profile pill in topbar */
        .topbar-admin-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px; border-radius: 10px;
          border: 1px solid #eaecf0; background: #fff; cursor: pointer;
          transition: all .14s;
        }
        .topbar-admin-pill:hover { border-color: #c7d2fe; background: #fafbff; }
        .topbar-admin-avatar {
          width: 28px; height: 28px; border-radius: 7px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; flex-shrink: 0;
        }
        .topbar-admin-name { font-size: 12.5px; font-weight: 700; color: #1e293b; }
        .topbar-admin-role {
          font-size: 9.5px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .06em; color: #6366f1;
          background: #eef2ff; padding: 2px 6px; border-radius: 5px;
        }

        /* Quick settings */
        .topbar-settings-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 9px;
          border: 1px solid #eaecf0; background: #fff;
          font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer;
          transition: all .14s;
        }
        .topbar-settings-btn:hover { background: #f8fafc; color: #334155; }

        /* ─── Main ─── */
        .admin-main { display: flex; flex-direction: column; min-height: 100vh; }
        .admin-content { flex: 1; padding: 24px; overflow-y: auto; }
        @media (max-width: 767px) { .admin-content { padding: 16px; } }

        /* ─── Mobile overlay ─── */
        .mobile-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,.45);
          backdrop-filter: blur(3px); z-index: 40;
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? '' : 'admin-sidebar-hidden'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link">
            <BrandIcon className="h-9 w-9 rounded-lg bg-white shadow-sm ring-1 ring-slate-100" imageClassName="object-contain p-1" />
            <span>
              <span className="sidebar-logo-name">MindSense</span>
              <span className="sidebar-logo-tag">Admin Panel</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-group-label">Core</div>
            {mainNav.map((item) => (
              <AdminSidebarItem
                key={item.label}
                {...item}
                active={
                  item.to === '/admin/overview'
                    ? location.pathname === '/admin' || location.pathname === item.to
                    : location.pathname.startsWith(item.to)
                }
              />
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-group-label">Content</div>
            {contentNav.map((item) => (
              <AdminSidebarItem
                key={item.label}
                {...item}
                active={location.pathname.startsWith(item.to)}
              />
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-group-label">System</div>
            {systemNav.map((item) => (
              <AdminSidebarItem
                key={item.label}
                {...item}
                active={location.pathname.startsWith(item.to)}
              />
            ))}
          </div>
        </nav>

        {/* Bottom: DB status + Profile */}
        <div className="sidebar-bottom">
          {/* Compact DB status */}
          <div className="db-status-row">
            <Database size={13} style={{ color: isDatabaseConnected ? '#10b981' : '#ef4444' }} />
            <span className="db-status-text">Database</span>
            <span className={`db-status-dot ${isDatabaseConnected ? 'db-dot-ok' : 'db-dot-err'}`} />
            <span className="db-status-label">{databaseStatusLabel}</span>
          </div>

          {/* Profile button */}
          <div className="relative" ref={profileMenuRef}>
            {/* Dropdown */}
            <div className={`sidebar-profile-menu ${profileMenuOpen ? 'sidebar-profile-menu-visible' : 'sidebar-profile-menu-hidden'}`}>
              {profileMenuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setProfileMenuOpen(false)}
                  className="sidebar-menu-item"
                >
                  <item.icon size={15} style={{ color: '#94a3b8' }} />
                  {item.label}
                </Link>
              ))}
              <div className="sidebar-menu-divider" />
              <Link
                to="/"
                onClick={() => setProfileMenuOpen(false)}
                className="sidebar-menu-item sidebar-menu-item-danger"
              >
                <LogOut size={15} />
                Sign out
              </Link>
            </div>

            <button
              onClick={() => setProfileMenuOpen((o) => !o)}
              className="sidebar-profile-btn"
              aria-expanded={profileMenuOpen}
            >
              <div className="sidebar-avatar">A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="sidebar-profile-name">Admin User</span>
                <span className="sidebar-profile-role">Superadmin</span>
              </div>
              <ChevronDown
                size={14}
                className="sidebar-profile-chevron"
                style={{ transform: profileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="topbar-search-wrap">
              <Search className="topbar-search-icon" size={14} />
              <input
                type="text"
                placeholder="Search resources, users, or settings…"
                className="topbar-search"
              />
            </div>
          </div>

          <div className="topbar-right">
            {/* Notifications */}
            <button className="topbar-icon-btn" aria-label="Notifications">
              <Bell size={17} />
              <span className="topbar-notif-dot" />
            </button>

            {/* Quick Settings */}
            <Link to="/admin/settings" className="topbar-settings-btn" style={{ textDecoration: 'none' }}>
              <Zap size={13} />
              Quick Settings
            </Link>

            {/* Admin profile pill */}
            <button className="topbar-admin-pill">
              <div className="topbar-admin-avatar">A</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <span className="topbar-admin-name">Admin User</span>
              </div>
              <span className="topbar-admin-role">SUPERADMIN</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
