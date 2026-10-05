import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { QuickActionsWidget } from '../../components/dashboard/DashboardWidgets';
import {
  CurrentAssessmentWidget,
  DashboardStatsRow,
  RecentAssessmentsReal,
  TrendWidgetReal,
} from '../../components/dashboard/DashboardDataWidgets';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMyAssessments } from '../../lib/api';
import { getStoredUserProfile } from '../../lib/userProfile';

export const NextBestActionCard = ({ latest }) => {
  const content = useMemo(() => {
    if (!latest) {
      return {
        title: 'Complete Your First Saved Assessment',
        body: 'Run a facial and behavioural assessment while signed in to unlock your dashboard history and trend view.',
      };
    }

    if (latest.risk_level === 'High Attention') {
      return {
        title: 'Take a Short Reset Break',
        body: 'Your latest saved result needs attention. Pause for a few minutes, reduce pressure, and consider support if this pattern continues.',
      };
    }

    if (latest.risk_level === 'Monitor') {
      return {
        title: 'Review Sleep and Stress Signals',
        body: 'Your latest saved result is in the monitor range. A quick check-in later can help confirm whether the signal is changing.',
      };
    }

    return {
      title: 'Keep Your Current Routine',
      body: 'Your latest saved result looks steady. Save another assessment later to build a clearer trend.',
    };
  }, [latest]);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-100">Recommended Next Action</h2>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{content.title}</h3>
        <p className="text-indigo-100 mt-2 text-sm max-w-2xl">
          {content.body}
        </p>
      </div>
      <div className="relative z-10 shrink-0 w-full md:w-auto">
        <Link to="/" className="w-full md:w-auto bg-white text-indigo-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" /> New Assessment
        </Link>
      </div>
    </div>
  );
};

export default function UserDashboardPage() {
  const [userProfile] = useState(() => getStoredUserProfile());
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const latestAssessment = assessments[0];

  useEffect(() => {
    let cancelled = false;

    async function loadAssessments() {
      setIsLoading(true);
      setError('');

      try {
        const data = await fetchMyAssessments();
        if (!cancelled) {
          setAssessments(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load dashboard data');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAssessments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-12">

        {/* Welcome Section */}
        <div className="mb-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome back, {userProfile.name}.</h1>
          <p className="text-slate-500 mt-1">Here is your saved wellness assessment history.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Sync Error</h3>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        <NextBestActionCard latest={latestAssessment} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <QuickActionsWidget />
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading dashboard data...
          </div>
        ) : (
          <>
            <DashboardStatsRow assessments={assessments} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CurrentAssessmentWidget latest={latestAssessment} />
              <TrendWidgetReal assessments={assessments} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <RecentAssessmentsReal assessments={assessments} />
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
