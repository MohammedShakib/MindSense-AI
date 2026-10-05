import React from 'react';
import {
  Activity,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  History,
  Mic,
  ScanFace,
  TrendingUp,
} from 'lucide-react';
import { openAssessmentReport } from '../../lib/report';

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function modalitiesPayload(assessment) {
  const payload = assessment?.modalities_used;
  if (Array.isArray(payload)) {
    return { used: payload };
  }
  return payload || { used: [] };
}

function hasModality(assessment, key) {
  return modalitiesPayload(assessment).used?.includes(key);
}

function scoreTone(level) {
  if (level === 'High Attention') return 'text-rose-700 bg-rose-50 border-rose-100';
  if (level === 'Monitor') return 'text-amber-700 bg-amber-50 border-amber-100';
  return 'text-emerald-700 bg-emerald-50 border-emerald-100';
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <History className="h-6 w-6" />
      </div>
      <h3 className="text-base font-black text-slate-800">No saved assessments yet</h3>
      <p className="mx-auto mt-1 max-w-md text-sm font-medium leading-6 text-slate-500">
        Complete a new assessment while signed in. Your score, signal breakdown, and history will appear here.
      </p>
    </div>
  );
}

export function DashboardStatsRow({ assessments }) {
  const latest = assessments[0];
  const previous = assessments[1];
  const latestScore = Math.round(latest?.final_score || 0);
  const previousScore = previous?.final_score == null ? null : Math.round(previous.final_score);
  const delta = previousScore == null ? null : latestScore - previousScore;
  const highAttentionCount = assessments.filter((item) => item.risk_level === 'High Attention').length;

  const stats = [
    {
      label: 'Latest Score',
      value: latest ? `${latestScore}/100` : '-',
      sub: latest ? latest.risk_level : 'Not available',
      icon: Activity,
      tone: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Saved Assessments',
      value: assessments.length,
      sub: 'Your history',
      icon: History,
      tone: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Score Change',
      value: delta == null ? '-' : `${delta > 0 ? '+' : ''}${delta}`,
      sub: previous ? 'Since previous' : 'Need one more',
      icon: TrendingUp,
      tone: delta > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'High Attention',
      value: highAttentionCount,
      sub: 'Saved results',
      icon: CheckCircle2,
      tone: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="flex items-center justify-between gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.tone}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              <div className="mt-1 text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
          <div className="mt-3 text-xs font-bold text-slate-500">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}

export function CurrentAssessmentWidget({ latest }) {
  if (!latest) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
        <EmptyState />
      </div>
    );
  }

  const score = Math.round(latest.final_score || 0);
  const payload = modalitiesPayload(latest);
  const mental = payload.mental;
  const facial = payload.facial;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Saved Assessment</div>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{score}/100</h2>
          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(latest.created_at)}
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wider ${scoreTone(latest.risk_level)}`}>
          {latest.risk_level}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <SignalCard
          icon={Brain}
          label="Behavioural"
          value={mental?.label || 'Saved'}
          confidence={latest.behavioural_confidence}
          available={hasModality(latest, 'behavioural')}
          color="indigo"
        />
        <SignalCard
          icon={ScanFace}
          label="Facial"
          value={facial?.label || 'Saved'}
          confidence={latest.facial_confidence}
          available={hasModality(latest, 'facial')}
          color="purple"
        />
        <SignalCard icon={FileText} label="Text" value="Not added" available={false} color="blue" />
        <SignalCard icon={Mic} label="Voice" value="Not added" available={false} color="cyan" />
      </div>
    </div>
  );
}

function SignalCard({ icon: Icon, label, value, confidence, available, color }) {
  const colors = {
    indigo: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    purple: 'text-purple-700 bg-purple-50 border-purple-100',
    blue: 'text-blue-700 bg-blue-50 border-blue-100',
    cyan: 'text-cyan-700 bg-cyan-50 border-cyan-100',
  };

  return (
    <div className={`rounded-2xl border p-4 ${available ? colors[color] : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-3 text-lg font-black">{value}</div>
      <div className="mt-1 text-xs font-bold opacity-70">
        {available && confidence != null ? `Confidence ${confidence}%` : 'Unavailable in current phase'}
      </div>
    </div>
  );
}

export function TrendWidgetReal({ assessments }) {
  const points = assessments
    .slice(0, 7)
    .reverse()
    .map((item) => Math.round(item.final_score || 0));
  const hasTrend = points.length >= 2;
  const width = 320;
  const height = 120;
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 100);
  const range = max - min || 1;
  const coords = points.map((value, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 18) - 9;
    return `${x},${y}`;
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Wellness Trend</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">Last {Math.min(assessments.length, 7)} saved assessments</p>
        </div>
        <BarChart3 className="h-5 w-5 text-indigo-500" />
      </div>

      {!hasTrend ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
          Save at least two assessments to see your trend.
        </div>
      ) : (
        <div className="h-48">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
            <polyline points={coords.join(' ')} fill="none" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {coords.map((point, index) => {
              const [x, y] = point.split(',').map(Number);
              return <circle key={index} cx={x} cy={y} r="5" fill="#fff" stroke="#4f46e5" strokeWidth="3" />;
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

export function RecentAssessmentsReal({ assessments }) {
  if (!assessments.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Recent Assessments</h3>
        <History className="h-5 w-5 text-slate-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Score</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Level</th>
              <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Signals</th>
              <th className="pb-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Report</th>
            </tr>
          </thead>
          <tbody>
            {assessments.slice(0, 6).map((item) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-4 text-sm font-bold text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formatDate(item.created_at)}
                  </span>
                </td>
                <td className="py-4 text-lg font-black text-slate-900">{Math.round(item.final_score || 0)}</td>
                <td className="py-4">
                  <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${scoreTone(item.risk_level)}`}>
                    {item.risk_level}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {hasModality(item, 'behavioural') && <Brain className="h-4 w-4 text-indigo-500" title="Behavioural" />}
                    {hasModality(item, 'facial') && <ScanFace className="h-4 w-4 text-purple-500" title="Facial" />}
                    {hasModality(item, 'text') && <FileText className="h-4 w-4 text-blue-500" title="Text" />}
                    {hasModality(item, 'voice') && <Mic className="h-4 w-4 text-cyan-500" title="Voice" />}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => openAssessmentReport({ assessment: item })}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
