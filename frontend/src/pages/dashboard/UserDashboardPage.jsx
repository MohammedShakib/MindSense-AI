import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import {
  WellnessScoreWidget,
  TrendWidget,
  AIInsightWidget,
  QuickActionsWidget,
  ProgressWidget,
  TasksWidget,
  RecentAssessmentsWidget
} from '../../components/dashboard/DashboardWidgets';
import { Sparkles, Video, AlertCircle } from 'lucide-react';
import { getStoredUserProfile } from '../../lib/userProfile';

export const NextBestActionCard = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-100">Recommended Next Action</h2>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight">Take a 5-Minute Breathing Break</h3>
        <p className="text-indigo-100 mt-2 text-sm max-w-2xl">
          Based on your recent vocal fatigue markers, a short breathing exercise will help lower your heart rate and re-center your focus for the afternoon.
        </p>
      </div>
      <div className="relative z-10 shrink-0 w-full md:w-auto">
        <button className="w-full md:w-auto bg-white text-indigo-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
          <Video className="w-5 h-5" /> Start Exercise
        </button>
      </div>
    </div>
  );
};

export default function UserDashboardPage() {
  // Mock states for demonstrating robust UI handling
  const [isLoading] = useState(false);
  const [userProfile] = useState(() => getStoredUserProfile());
  const hasError = false;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">

        {/* Welcome Section */}
        <div className="mb-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome back, {userProfile.name}.</h1>
          <p className="text-slate-500 mt-1">Here is your multimodal wellness snapshot for today.</p>
        </div>

        {/* Global Error State */}
        {hasError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Sync Error</h3>
              <p className="text-xs mt-1">We couldn't fetch your latest data from the server. Please try refreshing the page.</p>
            </div>
          </div>
        )}

        <NextBestActionCard />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ProgressWidget />
          <QuickActionsWidget />
        </div>

        {/* Top Section: Score, Actions, Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WellnessScoreWidget isLoading={isLoading} />
          <AIInsightWidget />
        </div>

        {/* Middle Section: Trend & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendWidget />
          <TasksWidget />
        </div>

        {/* History Table */}
        <div className="grid grid-cols-1 gap-6">
          <RecentAssessmentsWidget />
        </div>

      </div>
    </DashboardLayout>
  );
}
