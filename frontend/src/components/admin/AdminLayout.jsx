import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, FileBarChart, BrainCircuit, 
  ListChecks, Heart, Star, BarChart2, Activity, 
  ShieldCheck, Settings, LogOut, Menu, Bell, Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BrandIcon from '../BrandIcon';

const AdminSidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/30'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 xl:sticky xl:top-0 xl:bottom-auto z-50
        h-screen shrink-0
        w-[260px] bg-slate-950 flex flex-col shadow-[14px_0_30px_-28px_rgba(15,23,42,0.85)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <BrandIcon className="h-10 w-10 rounded-lg bg-white shadow-lg shadow-indigo-950/40 ring-1 ring-white/10" imageClassName="object-contain p-1" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-lg font-black tracking-tight text-white">MindSense</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-indigo-300">Admin</span>
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          <div className="space-y-1 mb-8">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">Core</div>
            {mainNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={item.to === '/admin/overview' ? location.pathname === '/admin' || location.pathname === item.to : location.pathname.startsWith(item.to)} />
            ))}
          </div>

          <div className="space-y-1 mb-8">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">Content</div>
            {contentNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={location.pathname.startsWith(item.to)} />
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">System</div>
            {systemNav.map((item) => (
              <AdminSidebarItem key={item.label} {...item} active={location.pathname.startsWith(item.to)} />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
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
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Superadmin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
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
