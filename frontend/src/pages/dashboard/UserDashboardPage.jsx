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
import { PlayCircle } from 'lucide-react';

export const RecommendedResourcesWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-1 lg:col-span-3">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recommended For You</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Browse Library →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Understanding Burnout", type: "Video", duration: "8 min", img: "bg-indigo-100" },
          { title: "The Science of Sleep", type: "Article", duration: "5 min read", img: "bg-purple-100" },
          { title: "Managing Daily Anxiety", type: "Audio", duration: "12 min", img: "bg-blue-100" },
        ].map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className={`w-full h-32 rounded-xl mb-3 relative overflow-hidden ${item.img} flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
               <PlayCircle className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-md" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                <div className="text-xs text-slate-500 mt-1">{item.type} • {item.duration}</div>
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
        <div className="mb-2">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Here is a snapshot of your mental wellness journey.</p>
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
