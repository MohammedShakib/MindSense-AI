import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, FileBarChart, BrainCircuit, 
  ListChecks, Heart, Star, BarChart2, Activity, 
  ShieldCheck, Settings, LogOut, Menu, Bell, Search, Database
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BrandIcon from '../BrandIcon';
import { fetchDatabaseStatus } from '../../lib/api';

const AdminSidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState({ connected: false, status: 'checking' });
  const [statusLoading, setStatusLoading] = useState(true);
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
      try {
        const nextDatabaseStatus = await fetchDatabaseStatus();
        if (!cancelled) {
          setDatabaseStatus(nextDatabaseStatus);
        }
      } catch {
        if (!cancelled) {
          setDatabaseStatus({ connected: false, status: 'disconnected' });
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

  const isDatabaseConnected = Boolean(databaseStatus.connected);
  const databaseStatusLabel = statusLoading
    ? 'Checking'
    : isDatabaseConnected
      ? 'Connected'
      : 'Disconnected';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 xl:pl-[260px]">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 z-50
        h-dvh min-h-screen shrink-0
        w-[260px] bg-white border-r border-slate-200 flex flex-col shadow-[12px_0_28px_-28px_rgba(15,23,42,0.45)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <BrandIcon className="h-10 w-10 rounded-lg bg-white shadow-md shadow-indigo-100 ring-1 ring-slate-100" imageClassName="object-contain p-1" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-lg font-black text-slate-950">MindSense</span>
              <span className="block text-[10px] font-black uppercase tracking-wide text-indigo-600">Admin</span>
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          <div className="space-y-1 mb-8">
            <div className="mb-3 px-4 text-[10px] font-black uppercase tracking-wide text-slate-500">Core</div>
            {mainNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={item.to === '/admin/overview' ? location.pathname === '/admin' || location.pathname === item.to : location.pathname.startsWith(item.to)} />
            ))}
          </div>

          <div className="space-y-1 mb-8">
            <div className="mb-3 px-4 text-[10px] font-black uppercase tracking-wide text-slate-500">Content</div>
            {contentNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={location.pathname.startsWith(item.to)} />
            ))}
          </div>

          <div className="space-y-1">
            <div className="mb-3 px-4 text-[10px] font-black uppercase tracking-wide text-slate-500">System</div>
            {systemNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={location.pathname.startsWith(item.to)} />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isDatabaseConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <Database className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black uppercase tracking-wide text-slate-500">Database</p>
                  <p className="truncate text-sm font-black leading-none text-slate-900">{databaseStatusLabel}</p>
                </div>
              </div>
              <span className={`h-3 w-3 shrink-0 rounded-full ${isDatabaseConnected ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]' : 'bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.15)]'}`} />
            </div>
          </div>

          {/* Profile Menu */}
          <div className="group relative">
            <button className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black leading-none text-slate-900">Admin User</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-slate-500">Superadmin</p>
              </div>
            </button>

            <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-60 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl shadow-slate-200/70 transition-all group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
              {profileMenuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <item.icon className="h-4 w-4 text-slate-400" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/"
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex min-h-screen min-w-0 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button
              className="xl:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search resources, users, or settings..."
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-80 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="w-full max-w-[1480px]">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
