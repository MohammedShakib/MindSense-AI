import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, PlusCircle, History, MessageSquare,
  CheckSquare, Heart, Video, FileText, User, Settings,
  LogOut, Menu, Bell, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandIcon from '../BrandIcon';

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
        active
          ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 shadow-sm border border-indigo-100/50'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && !collapsed && (
        <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
      )}
    </Link>
  );
};

const NotificationDropdown = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Notifications</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {[
          { title: "Daily Assessment Reminder", desc: "It's time for your evening check-in.", time: "10m ago", icon: PlusCircle, color: "text-blue-600 bg-blue-50" },
          { title: "Task Completed", desc: "You finished '10-min breathing'.", time: "2h ago", icon: CheckSquare, color: "text-emerald-600 bg-emerald-50" },
          { title: "Weekly Report Ready", desc: "Your wellness summary is available.", time: "1d ago", icon: FileText, color: "text-purple-600 bg-purple-50" },
          { title: "5-Day Streak!", desc: "You're on a roll. Keep it up!", time: "2d ago", icon: Heart, color: "text-rose-600 bg-rose-50" },
        ].map((n, i) => (
          <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.color}`}>
              <n.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{n.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{n.desc}</div>
              <div className="text-[10px] font-medium text-slate-400 mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const assessItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "New Assessment", to: "/dashboard/new", icon: PlusCircle },
    { label: "Assessment History", to: "/dashboard/history", icon: History },
  ];

  const wellnessItems = [
    { label: "MindSense Companion", to: "/dashboard/companion", icon: MessageSquare },
    { label: "Wellness Tasks", to: "/dashboard/tasks", icon: CheckSquare },
    { label: "Mindfulness", to: "/dashboard/mindfulness", icon: Heart },
    { label: "Recommendations", to: "/dashboard/recommendations", icon: Video },
    { label: "Reports", to: "/dashboard/reports", icon: FileText },
  ];

  const profileMenuItems = [
    { label: "Profile", to: "/dashboard/profile", icon: User },
    { label: "Settings", to: "/dashboard/settings", icon: Settings },
  ];

  // Close dropdowns on click outside (simplified for mockup)
  useEffect(() => {
    const handleClick = () => setNotifOpen(false);
    if (notifOpen) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [notifOpen]);

  return (
    <div className={`min-h-screen bg-[#F4F7FB] font-sans text-slate-900 transition-[padding] duration-300 ease-in-out ${collapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'}`}>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 h-screen
        ${collapsed ? 'w-[80px]' : 'w-[280px]'} bg-white border-r border-slate-200/60 flex flex-col
        transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
            <BrandIcon className="h-10 w-10 shrink-0 rounded-xl bg-white shadow-lg shadow-indigo-100 ring-1 ring-slate-100" imageClassName="object-contain p-1" />
            {!collapsed && <span className="font-bold text-xl text-slate-800 tracking-tight whitespace-nowrap">MindSense</span>}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
          <div className="space-y-1">
            {!collapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Assess</div>}
            {assessItems.map((item) => (
              <SidebarItem key={item.label} {...item} active={item.to === '/dashboard' ? location.pathname === item.to : location.pathname.startsWith(item.to)} collapsed={collapsed} />
            ))}
          </div>

          <div className="space-y-1">
            {!collapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Wellness</div>}
            {wellnessItems.map((item) => (
              <SidebarItem key={item.label} {...item} active={location.pathname.startsWith(item.to)} collapsed={collapsed} />
            ))}
          </div>
        </div>

        {/* Profile Menu */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <div className={`group relative ${collapsed ? 'flex justify-center' : ''}`}>
            <button
              className={`flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Sarah Jenkins' : undefined}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-sm font-black text-indigo-700">
                SJ
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black leading-none text-slate-800">Sarah Jenkins</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Premium</p>
                </div>
              )}
            </button>

            <div className={`pointer-events-none absolute bottom-full mb-2 w-60 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl shadow-slate-200/70 transition-all group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 ${collapsed ? 'left-full ml-3' : 'left-0'}`}>
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
              <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Topbar */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search assessments, reports, tasks..."
                className="pl-10 pr-12 py-2.5 bg-slate-100/50 border border-slate-200/50 hover:border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-[360px] transition-all"
              />
              <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 font-bold shadow-sm">
                  <span className="text-xs">Cmd</span> K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}
                className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
