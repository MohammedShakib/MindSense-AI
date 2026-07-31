import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Activity, TrendingUp, Sparkles, PlusCircle, MessageSquare,
  FileText, Download, CheckCircle2, Circle, Clock, ArrowRight,
  TrendingDown, MoreVertical, Calendar, Zap, Mic, ScanFace
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Utility for animating numbers
export function AnimatedNumber({ value }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;
    let timer = setInterval(() => {
      start += 1;
      setDisplay(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, reduced]);

  return <>{display}</>;
}

// Global Loading State component
export const WidgetSkeleton = ({ height = "h-64" }) => (
  <div className={`w-full ${height} bg-white rounded-2xl border border-slate-200 p-6 flex flex-col`}>
    <div className="w-1/3 h-5 bg-slate-100 rounded mb-6 animate-pulse"></div>
    <div className="flex-1 flex gap-4">
      <div className="w-1/2 h-full bg-slate-50 rounded-xl animate-pulse"></div>
      <div className="w-1/2 h-full bg-slate-50 rounded-xl animate-pulse"></div>
    </div>
  </div>
);

export const WellnessScoreWidget = ({ isLoading }) => {
  const [activeSignal, setActiveSignal] = useState(null);

  if (isLoading) return <WidgetSkeleton height="h-[360px]" />;

  const signals = [
    { id: 'b', label: 'Behavioural', score: 68, prev: 72, conf: 94, obs: "Sleep pattern disruption detected.", color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-500', border: 'hover:border-indigo-200' },
    { id: 't', label: 'Text & Chat', score: 74, prev: 70, conf: 98, obs: "Negative sentiment words increased.", color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500', border: 'hover:border-blue-200' },
    { id: 'f', label: 'Facial', score: 70, prev: 71, conf: 89, obs: "Micro-expressions indicate fatigue.", color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500', border: 'hover:border-purple-200' },
    { id: 'v', label: 'Voice', score: 76, prev: 65, conf: 92, obs: "Vocal jitter suggests elevated stress.", color: 'text-cyan-600', bg: 'bg-cyan-50', bar: 'bg-cyan-500', border: 'hover:border-cyan-200' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 col-span-1 lg:col-span-2 flex flex-col md:flex-row gap-8 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-20 -mt-20 opacity-60"></div>

      {/* Main Gauge Side */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
        <div className="flex justify-between w-full items-start mb-2">
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Current Assessment</div>
          <div className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Today, 9:41 AM
          </div>
        </div>

        <div className="relative w-52 h-52 my-4">
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md">
            <circle cx="104" cy="104" r="92" stroke="#f1f5f9" strokeWidth="18" fill="none" />
            <motion.circle
              cx="104" cy="104" r="92"
              stroke="url(#dashGrad)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="578"
              initial={{ strokeDashoffset: 578 }}
              animate={{ strokeDashoffset: 578 * 0.28 }} // 72/100
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="dashGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span className="text-6xl font-black text-slate-800 tracking-tighter drop-shadow-sm">
              <AnimatedNumber value={72} />
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            High Concern
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-white border border-rose-100 px-2 py-1.5 rounded-full shadow-sm">
            <TrendingUp className="w-3 h-3" /> +4 pts
          </div>
        </div>

        <button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2">
          View Full Analysis <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Signals Side */}
      <div className="flex-[1.2] w-full flex flex-col z-10">
        <div className="mb-4">
          <div className="text-sm font-bold text-slate-800">Multimodal Breakdown</div>
          <div className="text-xs text-slate-500">Click a signal card for details</div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {signals.map(signal => {
            const diff = signal.score - signal.prev;
            const isWorse = diff > 0;
            const isActive = activeSignal === signal.id;

            return (
              <div
                key={signal.id}
                onClick={() => setActiveSignal(isActive ? null : signal.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isActive ? `ring-2 ring-indigo-500 shadow-md ${signal.border}` : `border-slate-100 shadow-sm hover:shadow-md ${signal.border}`} ${isActive ? 'bg-white' : 'bg-white hover:bg-slate-50/50'}`}
              >
                {/* Default State */}
                <div className={`transition-opacity duration-300 ${isActive ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`text-xs font-bold uppercase tracking-wider ${signal.color}`}>{signal.label}</div>
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isWorse ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {isWorse ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(diff)}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800 leading-none mb-3">{signal.score}</div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${signal.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Expanded State */}
                <div className={`transition-opacity duration-300 absolute inset-0 p-4 ${isActive ? 'opacity-100 flex flex-col' : 'opacity-0 pointer-events-none'}`}>
                   <div className="flex justify-between items-start mb-3">
                    <div className={`text-xs font-bold uppercase tracking-wider ${signal.color}`}>{signal.label}</div>
                    <button onClick={(e) => { e.stopPropagation(); setActiveSignal(null); }} className="text-slate-400 hover:text-slate-600">×</button>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium"><span>Previous: {signal.prev}</span><span>Conf: {signal.conf}%</span></div>
                     <p className="text-xs text-slate-700 leading-snug font-medium italic border-l-2 border-indigo-200 pl-2 mt-2">"{signal.obs}"</p>
                   </div>
                   <div className="text-[10px] font-bold text-indigo-600 mt-2 flex items-center gap-1 uppercase">
                     Analyze Data <ArrowRight className="w-3 h-3" />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TrendWidget = () => {
  const [filter, setFilter] = useState('7D');

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Wellness Trend</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">72</span>
            <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border border-emerald-100">
              <TrendingDown className="w-3 h-3" /> 8% vs Prev {filter}
            </div>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['7D', '30D', '3M'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative mt-2 group-hover:scale-[1.01] transition-transform duration-500">
        {/* Improved Mock Chart */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6 opacity-30">
          <div className="border-b border-dashed border-slate-300 w-full flex-1"></div>
          <div className="border-b border-dashed border-slate-300 w-full flex-1"></div>
          <div className="border-b border-solid border-slate-200 w-full flex-1"></div>
        </div>

        <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Previous Period Line */}
          <path d="M0 25 L 15 28 L 30 22 L 45 26 L 60 18 L 75 20 L 90 25 L 100 22" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />

          {/* Current Area */}
          <motion.path
            d="M0 35 L 15 30 L 30 32 L 45 25 L 60 20 L 75 10 L 90 15 L 100 5 L 100 40 L 0 40 Z"
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          {/* Current Line */}
          <motion.path
            d="M0 35 L 15 30 L 30 32 L 45 25 L 60 20 L 75 10 L 90 15 L 100 5"
            fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {[
            {x: 0, y: 35}, {x: 15, y: 30}, {x: 30, y: 32}, {x: 45, y: 25},
            {x: 60, y: 20}, {x: 75, y: 10}, {x: 90, y: 15}, {x: 100, y: 5}
          ].map((point, i) => (
            <motion.circle
              key={i} cx={point.x} cy={point.y} r="1.5" fill="#fff" stroke="#4f46e5" strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + (i * 0.1) }}
              className="cursor-pointer hover:r-[2.5px] transition-all"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span className="text-indigo-600">Today</span>
        </div>
      </div>
    </div>
  );
};

export const AIInsightWidget = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 shadow-xl col-span-1 lg:col-span-1 text-white relative overflow-hidden flex flex-col border border-indigo-500/20">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">AI Insight</h3>
        </div>
        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white backdrop-blur-md">Just Updated</span>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1">What Changed</div>
          <p className="text-sm text-slate-200 leading-snug">Stress markers decreased 8% overall, but vocal fatigue remains high.</p>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-1">Main Contributing Signal</div>
          <div className="flex items-center gap-2 mt-1">
            <Mic className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold">Voice Pitch & Jitter (76/100)</span>
          </div>
        </div>

        <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-400/30">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Recommended Next Action</div>
          <p className="text-sm font-medium text-white">Complete a 5-min vocal rest & breathing session.</p>
        </div>
      </div>

      <button className="relative z-10 w-full mt-6 bg-white hover:bg-slate-100 text-indigo-900 rounded-xl py-3 text-sm font-bold transition-colors flex justify-center items-center gap-2 shadow-lg">
        Start Session <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ProgressWidget = () => {
  const stats = [
    { label: "Total Assessments", value: "24", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Current Streak", value: "5 Days", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completed Tasks", value: "18", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Latest Improvement", value: "Sleep +12%", icon: TrendingDown, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 col-span-1 lg:col-span-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all cursor-pointer">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 line-clamp-1">{stat.label}</div>
            <div className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TasksWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: "Morning reflection journal", duration: "5m", priority: "High", done: true },
    { id: 2, label: "Guided breathing session", duration: "10m", priority: "Med", done: true },
    { id: 3, label: "Afternoon voice check-in", duration: "2m", priority: "High", done: false },
    { id: 4, label: "Review wellness report", duration: "5m", priority: "Low", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const doneCount = tasks.filter(t => t.done).length;
  const progress = (doneCount / tasks.length) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-1 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Today's Tasks</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All →</button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Progress</span>
          <span className="text-indigo-600">{doneCount} of {tasks.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              className={`flex flex-col gap-2 p-3.5 rounded-2xl border transition-all cursor-pointer ${task.done ? 'bg-slate-50/80 border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow'}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${task.done ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {task.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-semibold block ${task.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {task.label}
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.duration}
                    </span>
                    {!task.done && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                        task.priority === 'Med' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const RecentAssessmentsWidget = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-1 lg:col-span-3 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Assessments</h3>
        <Link to="/dashboard/history" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View History →</Link>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concern Level</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modalities Used</th>
              <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Today, 9:41 AM", score: 72, change: "+4", level: "High Concern", levelColor: "text-rose-700 bg-rose-50 border-rose-100", signals: ['b', 't', 'f', 'v'] },
              { date: "Yesterday, 8:30 PM", score: 68, change: "-3", level: "Moderate", levelColor: "text-orange-700 bg-orange-50 border-orange-100", signals: ['b', 't', 'v'] },
              { date: "Oct 24, 10:15 AM", score: 71, change: "+10", level: "High Concern", levelColor: "text-rose-700 bg-rose-50 border-rose-100", signals: ['b', 't', 'f', 'v'] },
            ].map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                <td className="py-4">
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {row.date}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-900">{row.score}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${row.change.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {row.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {row.change}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-sm ${row.levelColor}`}>
                    {row.level}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1">
                    {row.signals.includes('b') && <Activity className="w-4 h-4 text-indigo-500" title="Behavioural" />}
                    {row.signals.includes('t') && <MessageSquare className="w-4 h-4 text-blue-500" title="Text" />}
                    {row.signals.includes('f') && <ScanFace className="w-4 h-4 text-purple-500" title="Facial" />}
                    {row.signals.includes('v') && <Mic className="w-4 h-4 text-cyan-500" title="Voice" />}
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all bg-white shadow-sm">
                      Compare
                    </button>
                    <button className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const QuickActionsWidget = () => {
  return (
    <div className="col-span-1 lg:col-span-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {[
        { label: "New Assessment", icon: PlusCircle, color: "text-indigo-600", bg: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
        { label: "Talk to AI", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
        { label: "View Plan", icon: FileText, color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
        { label: "Download Report", icon: Download, color: "text-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
      ].map((action, i) => (
        <button key={i} className={`flex items-center gap-2 px-4 py-3 rounded-xl border whitespace-nowrap transition-all shadow-sm hover:shadow shrink-0 ${action.bg}`}>
          <action.icon className={`w-4 h-4 ${action.color}`} />
          <span className={`text-sm font-bold ${action.color}`}>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
