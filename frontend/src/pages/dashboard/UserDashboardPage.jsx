import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { 
  WellnessScoreWidget, 
  TrendWidget, 
  AIInsightWidget,
  QuickActionsWidget,
  ProgressWidget,
  TasksWidget,
  MindfulnessWidget,
  RecentAssessmentsWidget
} from '../../components/dashboard/DashboardWidgets';
import { ArrowRight, CalendarCheck, PlayCircle, ShieldCheck, TrendingUp } from 'lucide-react';

const summaryItems = [
  { label: 'Latest score', value: '72', helper: 'High concern', icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
  { label: 'Current streak', value: '5 days', helper: '2 tasks left today', icon: CalendarCheck, color: 'text-amber-600 bg-amber-50' },
  { label: 'Privacy status', value: 'Protected', helper: 'Encrypted signals', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
];

export const RecommendedResourcesWidget = () => {
  return (
    <div className="col-span-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 lg:col-span-3">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.18em]">Recommended For You</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Browse Library -&gt;</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Understanding Burnout", type: "Video", duration: "8 min", img: "bg-indigo-100 text-indigo-600" },
          { title: "The Science of Sleep", type: "Article", duration: "5 min read", img: "bg-purple-100 text-purple-600" },
          { title: "Managing Daily Anxiety", type: "Audio", duration: "12 min", img: "bg-blue-100 text-blue-600" },
        ].map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className={`w-full h-32 rounded-lg mb-3 relative overflow-hidden ${item.img} flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
               <PlayCircle className="w-10 h-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                <div className="text-xs text-slate-500 mt-1">{item.type} / {item.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UserDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">
        
        {/* Welcome Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">MindSense AI</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Your Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Here is a focused snapshot of your latest wellness signals, recommended actions, and assessment progress.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700">
                Start assessment <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                View report
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="mt-1 text-lg font-black leading-none text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Section: Score, Actions, Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WellnessScoreWidget />
          <TrendWidget />
          <AIInsightWidget />
          <QuickActionsWidget />
        </div>

        {/* Middle Section: Progress & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProgressWidget />
          <TasksWidget />
        </div>

        {/* Mindfulness & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <MindfulnessWidget />
          <RecommendedResourcesWidget />
        </div>

        {/* History Table */}
        <div className="grid grid-cols-1 gap-6">
          <RecentAssessmentsWidget />
        </div>

      </div>
    </DashboardLayout>
  );
}
