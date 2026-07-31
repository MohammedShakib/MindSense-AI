import React, { useState } from 'react';
import { 
  LayoutDashboard, PlusCircle, History, MessageSquare, 
  CheckSquare, Heart, Video, FileText, User, Settings, 
  LogOut, Menu, Bell, Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BrandIcon from '../BrandIcon';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
      {label}
    </Link>
  );
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "New Assessment", to: "/dashboard/new", icon: PlusCircle },
    { label: "Assessment History", to: "/dashboard/history", icon: History },
    { label: "MindSense Companion", to: "/dashboard/companion", icon: MessageSquare },
    { label: "Wellness Tasks", to: "/dashboard/tasks", icon: CheckSquare },
    { label: "Mindfulness", to: "/dashboard/mindfulness", icon: Heart },
    { label: "Recommendations", to: "/dashboard/recommendations", icon: Video },
    { label: "Reports", to: "/dashboard/reports", icon: FileText },
  ];

  const bottomItems = [
    { label: "Profile", to: "/dashboard/profile", icon: User },
    { label: "Settings", to: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 lg:sticky lg:top-0 lg:bottom-auto z-50
        h-screen shrink-0
        w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-[12px_0_28px_-28px_rgba(15,23,42,0.45)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <BrandIcon className="h-11 w-11 rounded-lg bg-white shadow-md shadow-indigo-100 ring-1 ring-slate-100" imageClassName="object-contain p-1" />
            <span className="leading-tight">
              <span className="block text-xl font-black tracking-tight text-slate-900">MindSense</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">AI Wellness</span>
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={item.to === '/dashboard' ? location.pathname === item.to : location.pathname.startsWith(item.to)}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          {bottomItems.map((item) => (
            <SidebarItem 
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mt-2">
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-100 outline-none w-72 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                U
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">User</p>
                <p className="text-xs text-slate-500 mt-1">Premium Plan</p>
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="w-full max-w-[1480px]">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
