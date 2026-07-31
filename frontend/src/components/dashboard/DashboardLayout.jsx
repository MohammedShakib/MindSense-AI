import React, { useState } from 'react';
import { 
  LayoutDashboard, PlusCircle, History, MessageSquare, 
  CheckSquare, Heart, Video, FileText, User, Settings, 
  LogOut, Menu, Bell, Search, BrainCircuit 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, active }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">MindSense</span>
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
              active={location.pathname === item.to}
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
              active={location.pathname === item.to}
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
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
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
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
