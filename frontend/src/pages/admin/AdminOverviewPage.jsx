import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, UserCheck, FileBarChart, Activity, PieChart, TrendingUp, TrendingDown, Target } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
    <div className="text-2xl font-black text-slate-800">{value}</div>
  </div>
);

export default function AdminOverviewPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor MindSense AI platform metrics and user activity.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Total Users" value="12,485" change="+12.5%" isPositive={true} icon={Users} />
        <StatCard title="Active Users" value="8,192" change="+5.2%" isPositive={true} icon={UserCheck} />
        <StatCard title="Total Assessments" value="145,820" change="+18.1%" isPositive={true} icon={FileBarChart} />
        <StatCard title="Assessments Today" value="1,248" change="-2.4%" isPositive={false} icon={Activity} />
        <StatCard title="Avg. Completeness" value="94%" change="+1.1%" isPositive={true} icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User Growth Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">User Growth & Activity</h3>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="w-full h-64 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center relative overflow-hidden">
             {/* Mock Chart Grid */}
             <div className="absolute inset-0 flex flex-col justify-between py-8 px-4 opacity-10">
               {[...Array(5)].map((_, i) => <div key={i} className="w-full border-b border-slate-900"></div>)}
             </div>
             {/* Mock Line */}
             <svg className="w-full h-full relative z-10 text-indigo-500 px-4" viewBox="0 0 100 40" preserveAspectRatio="none">
               <path d="M0 35 L 10 32 L 20 30 L 30 25 L 40 28 L 50 20 L 60 22 L 70 15 L 80 10 L 90 12 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               <path d="M0 35 L 10 32 L 20 30 L 30 25 L 40 28 L 50 20 L 60 22 L 70 15 L 80 10 L 90 12 L 100 5 L 100 40 L 0 40 Z" fill="currentColor" fillOpacity="0.1" />
             </svg>
          </div>
        </div>

        {/* Concern-Level Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Concern Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { level: "Low Concern", percent: 45, color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
              { level: "Moderate Concern", percent: 30, color: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50" },
              { level: "High Concern", percent: 18, color: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
              { level: "Critical", percent: 7, color: "bg-red-700", text: "text-red-800", bg: "bg-red-100" },
            ].map(item => (
              <div key={item.level}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className={item.text}>{item.level}</span>
                  <span className="text-slate-600">{item.percent}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${item.bg} overflow-hidden`}>
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="text-xs text-slate-500 mb-2">Total High/Critical Alerts Today</div>
            <div className="text-2xl font-black text-rose-600 flex items-center gap-2">
              142 <span className="text-xs font-bold bg-rose-100 px-2 py-1 rounded-md text-rose-700">-5%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
