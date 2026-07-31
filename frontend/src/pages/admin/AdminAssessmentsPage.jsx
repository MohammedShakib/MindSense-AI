import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Download } from 'lucide-react';

export default function AdminAssessmentsPage() {
  const assessments = [
    { id: "A-8492", user: "Sarah Jenkins", date: "Today, 09:41 AM", scores: { b: 68, t: 74, f: 70, v: 76 }, final: 72, level: "High Concern", comp: "100%" },
    { id: "A-8491", user: "Michael Chen", date: "Today, 08:30 AM", scores: { b: 45, t: 50, f: 42, v: 48 }, final: 46, level: "Low Concern", comp: "100%" },
    { id: "A-8490", user: "Emma Wilson", date: "Yesterday, 14:20 PM", scores: { b: 82, t: 85, f: '-', v: 80 }, final: 82, level: "Critical", comp: "75%" },
    { id: "A-8489", user: "David Kim", date: "Yesterday, 11:15 AM", scores: { b: 55, t: 60, f: 58, v: 62 }, final: 58, level: "Moderate", comp: "100%" },
    { id: "A-8488", user: "Olivia Davis", date: "Oct 24, 09:00 AM", scores: { b: 75, t: '-', f: '-', v: '-' }, final: 75, level: "High Concern", comp: "25%" },
  ];

  const getLevelColor = (level) => {
    switch(level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High Concern': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Moderate': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low Concern': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const ScorePill = ({ score, type }) => {
    if (score === '-') return <span className="text-slate-300 font-medium">-</span>;
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
        type === 'b' ? 'bg-indigo-50 text-indigo-700' :
        type === 't' ? 'bg-blue-50 text-blue-700' :
        type === 'f' ? 'bg-purple-50 text-purple-700' :
        'bg-cyan-50 text-cyan-700'
      }`}>
        {score}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assessments Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Review multimodal signal scores and platform-wide assessment data.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by ID or User..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Concern Levels</option>
              <option>Critical</option>
              <option>High Concern</option>
              <option>Moderate</option>
              <option>Low Concern</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID / User</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Behav.</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Text</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Facial</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Voice</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Final Score</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concern Level</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Comp.</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-xs font-mono font-bold text-slate-400 mb-0.5">{a.id}</div>
                    <div className="text-sm font-bold text-slate-800">{a.user}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {a.date}
                  </td>
                  <td className="px-4 py-4 text-center"><ScorePill score={a.scores.b} type="b" /></td>
                  <td className="px-4 py-4 text-center"><ScorePill score={a.scores.t} type="t" /></td>
                  <td className="px-4 py-4 text-center"><ScorePill score={a.scores.f} type="f" /></td>
                  <td className="px-4 py-4 text-center"><ScorePill score={a.scores.v} type="v" /></td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg font-black text-slate-900">{a.final}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(a.level)}`}>
                      {a.level}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-bold ${a.comp === '100%' ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {a.comp}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
