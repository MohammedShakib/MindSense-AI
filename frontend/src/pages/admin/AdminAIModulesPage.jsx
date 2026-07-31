import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Cpu, MessageSquare, ScanFace, Mic, GitMerge, Server, Gauge, Clock3 } from 'lucide-react';

const ModuleCard = ({ title, icon: Icon, version, status, processing, lastUpdated, errors, color, bgColor, isEngine }) => (
  <div className={`bg-white rounded-lg border ${isEngine ? 'border-indigo-300 shadow-md ring-1 ring-indigo-100' : 'border-slate-200 shadow-sm shadow-slate-200/70'} overflow-hidden flex flex-col`}>
    <div className={`p-4 border-b ${isEngine ? 'bg-indigo-50/50 border-indigo-100' : 'border-slate-100'} flex justify-between items-start`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${bgColor} ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <div className="text-xs font-mono text-slate-500 mt-0.5">v{version}</div>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
        status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
      }`}>
        {status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
        {status}
      </div>
    </div>
    
    <div className="p-5 flex-1 flex flex-col gap-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">Processing Status:</span>
        <span className="font-medium text-slate-800 flex items-center gap-2">
          {processing === 'Idle' ? (
            <span className="text-slate-400">Idle</span>
          ) : processing === 'Processing' ? (
            <><RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Processing</>
          ) : (
            <span className="text-emerald-600">Online</span>
          )}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">Error Rate (24h):</span>
        <span className={`font-medium ${errors > 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
          {errors}%
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500">Last Updated:</span>
        <span className="font-medium text-slate-800">{lastUpdated}</span>
      </div>
    </div>
    
    <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between">
      <button className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 transition-colors">View Logs</button>
      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 transition-colors">Restart Module</button>
    </div>
  </div>
);

const ResourceMetric = ({ label, value, bar, color, barColor }) => (
  <div>
    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
      <span>{label}</span>
      <span className={color}>{value}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${barColor} rounded-full`} style={{ width: bar }}></div>
    </div>
  </div>
);

export default function AdminAIModulesPage() {
  const modules = [
    { title: "Behavioural Model", icon: Activity, version: "2.4.1", status: "Active", processing: "Processing", lastUpdated: "2 hours ago", errors: 0.1, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { title: "Text/NLP Model", icon: MessageSquare, version: "3.1.0", status: "Active", processing: "Idle", lastUpdated: "1 day ago", errors: 0.05, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Facial Analysis", icon: ScanFace, version: "1.9.5", status: "Active", processing: "Processing", lastUpdated: "5 hours ago", errors: 1.2, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Voice & Speech", icon: Mic, version: "2.0.0", status: "Degraded", processing: "Online", lastUpdated: "10 mins ago", errors: 3.5, color: "text-cyan-600", bgColor: "bg-cyan-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Admin Control</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">AI Infrastructure</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Monitor multimodal model health, processing status, and operational resource usage.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700">
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { label: 'Online modules', value: '4 / 5', helper: '1 degraded service', icon: Server, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Error budget', value: '98.7%', helper: 'Last 24 hours', icon: Gauge, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Queue latency', value: '142 ms', helper: 'P95 inference time', icon: Clock3, color: 'text-amber-600 bg-amber-50' },
          ].map((item) => (
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

      <div className="mb-8">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700">Core Orchestrator</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <ModuleCard
            title="Multimodal Fusion Engine"
            icon={GitMerge}
            version="4.0.0-rc2"
            status="Active"
            processing="Processing"
            lastUpdated="Just now"
            errors={0.01}
            color="text-indigo-700"
            bgColor="bg-indigo-100"
            isEngine={true}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700">Signal Models</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
          {modules.map((mod, i) => (
            <ModuleCard key={i} {...mod} />
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-lg bg-slate-900 p-6 text-white shadow-lg shadow-slate-300/60">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">System Resources</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ResourceMetric label="GPU Utilization" value="42%" bar="42%" color="text-emerald-400" barColor="bg-emerald-400" />
          <ResourceMetric label="Memory (VRAM)" value="78%" bar="78%" color="text-orange-400" barColor="bg-orange-400" />
          <ResourceMetric label="Active Inference Queue" value="14 req/s" bar="20%" color="text-indigo-400" barColor="bg-indigo-400" />
        </div>
      </div>
    </AdminLayout>
  );
}
