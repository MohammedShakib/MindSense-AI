import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Activity, TrendingUp, Sparkles, PlusCircle, MessageSquare, 
  FileText, Download, CheckCircle2, Circle, Heart, Wind, 
  Target, PlayCircle, Clock, ArrowRight, BrainCircuit
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

export const WellnessScoreWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 col-span-1 lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
      
      {/* Gauge Side */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-6 text-center">Wellness Concern Score</div>
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="84" stroke="#f1f5f9" strokeWidth="16" fill="none" />
            <motion.circle 
              cx="96" cy="96" r="84" 
              stroke="url(#dashGrad)" 
              strokeWidth="16" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="527.7"
              initial={{ strokeDashoffset: 527.7 }}
              animate={{ strokeDashoffset: 527.7 * 0.28 }} // 72/100
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
            <span className="text-5xl font-black text-slate-800 tracking-tighter">
              <AnimatedNumber value={72} />
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>
        <div className="mt-4 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
          High Concern
        </div>
        <div className="text-xs text-slate-400 mt-3">Last assessment: Today, 9:41 AM</div>
      </div>

      {/* Signals Side */}
      <div className="flex-1 w-full grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-2 text-center md:text-left">
          <div className="text-sm font-bold text-slate-800">4 Signals → 1 Assessment</div>
          <div className="text-xs text-slate-500">AI fused multimodal analysis</div>
        </div>
        
        {[
          { label: 'Behavioural', score: 68, color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-500' },
          { label: 'Text & Chat', score: 74, color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500' },
          { label: 'Facial', score: 70, color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500' },
          { label: 'Voice', score: 76, color: 'text-cyan-600', bg: 'bg-cyan-50', bar: 'bg-cyan-500' }
        ].map(signal => (
          <div key={signal.label} className={`p-4 rounded-xl border border-slate-100 ${signal.bg}`}>
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${signal.color}`}>{signal.label}</div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-black text-slate-800 leading-none">{signal.score}</span>
              <span className="text-[10px] text-slate-500 font-medium">Confidence: 94%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${signal.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${signal.score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TrendWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 col-span-1 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Wellness Trend</h3>
          <p className="text-xs text-slate-500">Last 7 Assessments</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
          Concern decreased by 8%
        </div>
      </div>
      
      <div className="flex-1 w-full relative mt-4">
        {/* Simple mock chart */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          <div className="border-b border-slate-100 w-full flex-1"></div>
          <div className="border-b border-slate-100 w-full flex-1"></div>
          <div className="border-b border-slate-100 w-full flex-1"></div>
        </div>
        <svg className="w-full h-full relative z-10 text-indigo-500" viewBox="0 0 100 40" preserveAspectRatio="none">
          <motion.path 
            d="M0 35 L 15 30 L 30 32 L 45 25 L 60 20 L 75 10 L 90 15 L 100 5" 
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-medium text-slate-400 px-1">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
        </div>
      </div>
    </div>
  );
};

export const AIInsightWidget = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 shadow-lg col-span-1 text-white relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Wellness Insight</h3>
      </div>
      
      <p className="text-sm leading-relaxed text-slate-300 relative z-10 mb-6 flex-1">
        Based on your latest multimodal signals, your stress markers have slightly decreased since yesterday. However, vocal patterns indicate lingering mental fatigue. 
        <br/><br/>
        We recommend a 5-minute breathing reset before your next deep-work session.
      </p>

      <button className="relative z-10 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl py-3 text-sm font-semibold transition-colors flex justify-center items-center gap-2">
        View Full Assessment <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ProgressWidget = () => {
  const stats = [
    { label: "Total Assessments", value: "24", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Current Streak", value: "5 Days", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completed Tasks", value: "18", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Latest Improvement", value: "Sleep", icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 col-span-1 lg:col-span-3">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-xl font-black text-slate-800">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const QuickActionsWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 transition-colors group">
          <PlusCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-center">Start New<br/>Assessment</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors group">
          <MessageSquare className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-center">MindSense<br/>Companion</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors group">
          <FileText className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-center">View Wellness<br/>Plan</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors group">
          <Download className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-center">Download<br/>Report</span>
        </button>
      </div>
    </div>
  );
};

export const TasksWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Today's Tasks</h3>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">2/4 Done</span>
      </div>
      <div className="space-y-3 flex-1">
        {[
          { label: "Complete morning reflection journal", done: true },
          { label: "10-minute guided breathing session", done: true },
          { label: "Afternoon voice check-in", done: false },
          { label: "Review weekly wellness report", done: false },
        ].map((task, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${task.done ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-200'}`}>
            <button className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors">
              {task.done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
            </button>
            <span className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MindfulnessWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-1 lg:col-span-3">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mindfulness Quick Access</h3>
        <Link to="/dashboard/mindfulness" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Focus Reset", duration: "5 min", type: "Breathing", icon: Wind, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
          { title: "Stress Relief", duration: "10 min", type: "Meditation", icon: Heart, color: "bg-rose-50 text-rose-600 border-rose-100" },
          { title: "Evening Wind Down", duration: "15 min", type: "Guided", icon: Clock, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-sm hover:shadow-md`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center mix-blend-multiply">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded-md">{item.duration}</span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{item.type}</div>
              <div className="font-bold text-base leading-tight">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecentAssessmentsWidget = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm col-span-1 lg:col-span-3 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Assessments</h3>
        <Link to="/dashboard/history" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View History →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Concern Level</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Signals Used</th>
              <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Today, 9:41 AM", score: 72, level: "High Concern", levelColor: "text-rose-600 bg-rose-50", signals: 4 },
              { date: "Yesterday, 8:30 PM", score: 65, level: "Moderate", levelColor: "text-orange-600 bg-orange-50", signals: 3 },
              { date: "Oct 24, 10:15 AM", score: 45, level: "Low Concern", levelColor: "text-emerald-600 bg-emerald-50", signals: 4 },
              { date: "Oct 20, 2:00 PM", score: 50, level: "Moderate", levelColor: "text-orange-600 bg-orange-50", signals: 2 },
            ].map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 text-sm font-medium text-slate-800">{row.date}</td>
                <td className="py-4 text-sm font-black text-slate-800">{row.score}</td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${row.levelColor}`}>
                    {row.level}
                  </span>
                </td>
                <td className="py-4 text-sm text-slate-500 font-medium">{row.signals}/4 Signals</td>
                <td className="py-4 text-right">
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
