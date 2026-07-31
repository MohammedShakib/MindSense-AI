import React, { useMemo, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock,
  Database,
  FileBarChart,
  FileText,
  Mic,
  PieChart,
  RefreshCw,
  Server,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  BarChart2,
  GitMerge,
} from 'lucide-react';

// ─── Date Range Picker ────────────────────────────────────────────────────────
const DATE_RANGES = [
  { label: 'Today', key: '1d' },
  { label: '7 Days', key: '7d' },
  { label: '30 Days', key: '30d' },
  { label: '3 Months', key: '3m' },
];

function DateRangePicker({ value, onChange }) {
  return (
    <div className="ov-date-tabs">
      {DATE_RANGES.map((r) => (
        <button
          key={r.key}
          className={`ov-date-tab ${value === r.key ? 'ov-date-tab-active' : ''}`}
          onClick={() => onChange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#6366f1', fill = 'rgba(99,102,241,0.12)' }) {
  if (!data || data.length < 2) return null;
  const w = 72, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const d = `M${pts.join(' L')}`;
  const fillD = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ overflow: 'visible' }}>
      <path d={fillD} fill={fill} />
      <path d={d} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Mock data generators ─────────────────────────────────────────────────────
function mockSeries(base, len, variance = 0.15) {
  const pts = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = Math.max(0, v * (1 + (Math.random() - 0.45) * variance));
    pts.push(Math.round(v));
  }
  return pts;
}

const RANGE_POINTS = { '1d': 24, '7d': 7, '30d': 30, '3m': 12 };

const RANGE_LABELS = {
  '1d': Array.from({ length: 24 }, (_, i) => `${i}:00`),
  '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': Array.from({ length: 30 }, (_, i) => `D${i + 1}`),
  '3m': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 12),
};

function buildChartData(range) {
  const n = RANGE_POINTS[range];
  return {
    labels: RANGE_LABELS[range].slice(0, n),
    users: mockSeries(8000, n, 0.08),
    activeUsers: mockSeries(5200, n, 0.10),
    assessments: mockSeries(1100, n, 0.18),
  };
}

// ─── Inline SVG Area Chart ────────────────────────────────────────────────────
function AreaChart({ data, activeLines }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const W = 600, H = 190, PL = 52, PR = 16, PT = 28, PB = 36;
  const iW = W - PL - PR, iH = H - PT - PB;

  const series = useMemo(() => {
    const map = {
      users: { key: 'users', color: '#6366f1', fill: 'rgba(99,102,241,0.10)', label: 'Total Users' },
      activeUsers: { key: 'activeUsers', color: '#10b981', fill: 'rgba(16,185,129,0.10)', label: 'Active Users' },
      assessments: { key: 'assessments', color: '#f59e0b', fill: 'rgba(245,158,11,0.10)', label: 'Assessments' },
    };
    return Object.values(map).filter((s) => activeLines.includes(s.key));
  }, [activeLines]);

  const allVals = series.flatMap((s) => data[s.key] || []);
  const yMin = 0;
  const yMax = allVals.length ? Math.ceil(Math.max(...allVals) * 1.12) : 1;

  function toX(i) { return PL + (i / Math.max(data.labels.length - 1, 1)) * iW; }
  function toY(v) { return PT + iH - ((v - yMin) / (yMax - yMin)) * iH; }

  function makePath(vals) {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  }
  function makeFill(vals) {
    const line = makePath(vals);
    const n = vals.length - 1;
    return `${line} L${toX(n).toFixed(1)},${(PT + iH).toFixed(1)} L${PL.toFixed(1)},${(PT + iH).toFixed(1)} Z`;
  }

  // Y axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const v = yMin + (i / yTicks) * (yMax - yMin);
    return { v, y: toY(v), label: v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v) };
  });

  // X axis labels — thin out if too many
  const n = data.labels.length;
  const step = n <= 12 ? 1 : n <= 30 ? 5 : Math.ceil(n / 10);
  const xLabels = data.labels
    .map((l, i) => ({ l, i }))
    .filter(({ i }) => i % step === 0 || i === n - 1);

  function handleMouseMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((svgX - PL) / iW) * (n - 1));
    const clamped = Math.max(0, Math.min(n - 1, idx));
    const tipX = toX(clamped);
    setTooltip({ idx: clamped, x: tipX, label: data.labels[clamped], vals: series.map((s) => ({ ...s, v: data[s.key][clamped] })) });
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid */}
        {yLabels.map(({ y, label }) => (
          <g key={label}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{label}</text>
          </g>
        ))}

        {/* X labels */}
        {xLabels.map(({ l, i }) => (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{l}</text>
        ))}

        {/* Series fill + line */}
        {series.map((s) => (
          <g key={s.key}>
            <path d={makeFill(data[s.key])} fill={s.fill} />
            <path d={makePath(data[s.key])} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* Tooltip crosshair */}
        {tooltip && (
          <>
            <line x1={tooltip.x} y1={PT} x2={tooltip.x} y2={PT + iH} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
            {tooltip.vals.map((s) => (
              <circle key={s.key} cx={tooltip.x} cy={toY(s.v)} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
            ))}
          </>
        )}
      </svg>

      {/* Tooltip box */}
      {tooltip && (
        <div
          className="chart-tooltip"
          style={{
            left: tooltip.x < PL + 60 ? 0 : tooltip.x > W - PR - 60 ? 'auto' : `${(tooltip.x / W) * 100}%`,
            right: tooltip.x > W - PR - 60 ? 0 : 'auto',
            transform: tooltip.x < PL + 60 || tooltip.x > W - PR - 60 ? 'none' : 'translateX(-50%)',
          }}
        >
          <div className="chart-tooltip-label">{tooltip.label}</div>
          {tooltip.vals.map((s) => (
            <div key={s.key} className="chart-tooltip-row">
              <span className="chart-tooltip-dot" style={{ background: s.color }} />
              <span className="chart-tooltip-name">{s.label}</span>
              <span className="chart-tooltip-val">{s.v?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPI_PALETTE = {
  indigo: { icon: '#6366f1', bg: '#eef2ff', spark: '#6366f1', sparkFill: 'rgba(99,102,241,0.12)' },
  emerald: { icon: '#059669', bg: '#ecfdf5', spark: '#10b981', sparkFill: 'rgba(16,185,129,0.12)' },
  amber: { icon: '#d97706', bg: '#fffbeb', spark: '#f59e0b', sparkFill: 'rgba(245,158,11,0.12)' },
  rose: { icon: '#e11d48', bg: '#fff1f2', spark: '#f43f5e', sparkFill: 'rgba(244,63,94,0.12)' },
  violet: { icon: '#7c3aed', bg: '#f5f3ff', spark: '#8b5cf6', sparkFill: 'rgba(139,92,246,0.12)' },
};

function KpiCard({ icon: Icon, label, value, change, isPositive, spark, color = 'indigo', sub }) {
  const p = KPI_PALETTE[color];
  return (
    <div className="kpi-card2">
      <div className="kpi2-top">
        <div className="kpi2-icon" style={{ background: p.bg }}>
          <Icon size={16} style={{ color: p.icon }} />
        </div>
        {change && (
          <span className={`kpi2-badge ${isPositive ? 'kpi2-badge-up' : 'kpi2-badge-down'}`}>
            {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {change}
          </span>
        )}
      </div>
      <div className="kpi2-label">{label}</div>
      <div className="kpi2-value">{value}</div>
      {sub && <div className="kpi2-sub">{sub}</div>}
      <div className="kpi2-spark">
        <Sparkline data={spark} color={p.spark} fill={p.sparkFill} />
      </div>
    </div>
  );
}

// ─── System Health ─────────────────────────────────────────────────────────────
const HEALTH_SERVICES = [
  { name: 'API Gateway', key: 'api', icon: Server, status: 'healthy', latency: '42ms' },
  { name: 'Database', key: 'db', icon: Database, status: 'healthy', latency: '8ms' },
  { name: 'Behaviour Model', key: 'behav', icon: Brain, status: 'healthy', latency: '210ms' },
  { name: 'Text Model', key: 'text', icon: FileText, status: 'warning', latency: '540ms' },
  { name: 'Face Model', key: 'face', icon: Video, status: 'healthy', latency: '180ms' },
  { name: 'Voice Model', key: 'voice', icon: Mic, status: 'healthy', latency: '165ms' },
  { name: 'Fusion Engine', key: 'fusion', icon: GitMerge, status: 'healthy', latency: '92ms' },
];

const STATUS_CFG = {
  healthy: { label: 'Healthy', dot: '#10b981', bg: '#ecfdf5', text: '#059669' },
  warning: { label: 'Warning', dot: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  down: { label: 'Down', dot: '#ef4444', bg: '#fff1f2', text: '#e11d48' },
};

function SystemHealth() {
  return (
    <div className="ov-card">
      <div className="ov-card-header">
        <div className="ov-card-title"><Shield size={15} /> System & AI Health</div>
        <span className="ov-card-meta"><Clock size={12} /> Checked 2m ago</span>
      </div>
      <div className="health-list">
        {HEALTH_SERVICES.map((svc) => {
          const cfg = STATUS_CFG[svc.status];
          return (
            <div key={svc.key} className="health-row">
              <div className="health-icon-wrap">
                <svc.icon size={14} style={{ color: '#64748b' }} />
              </div>
              <span className="health-name">{svc.name}</span>
              <span className="health-latency">{svc.latency}</span>
              <span className="health-badge" style={{ background: cfg.bg, color: cfg.text }}>
                <span className="health-dot" style={{ background: cfg.dot }} />
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Assessment Funnel ────────────────────────────────────────────────────────
const FUNNEL_STEPS = [
  { label: 'Started', value: 1248, pct: 100 },
  { label: 'Questionnaire', value: 1181, pct: 94.6 },
  { label: 'Text Analysis', value: 1042, pct: 83.5 },
  { label: 'Face Analysis', value: 897, pct: 71.9 },
  { label: 'Voice Analysis', value: 812, pct: 65.1 },
  { label: 'Completed', value: 748, pct: 59.9 },
];
const FUNNEL_COLORS = ['#6366f1', '#818cf8', '#38bdf8', '#34d399', '#a3e635', '#10b981'];

function AssessmentFunnel() {
  return (
    <div className="ov-card">
      <div className="ov-card-header">
        <div className="ov-card-title"><BarChart2 size={15} /> Assessment Completion Funnel</div>
        <span className="ov-card-meta">Today</span>
      </div>
      <div className="funnel-list">
        {FUNNEL_STEPS.map((step, i) => {
          const dropPct = i > 0 ? (100 - (step.value / FUNNEL_STEPS[i - 1].value) * 100).toFixed(1) : null;
          return (
            <div key={step.label} className="funnel-row">
              <div className="funnel-meta">
                <span className="funnel-label">{step.label}</span>
                <span className="funnel-val">{step.value.toLocaleString()}</span>
              </div>
              <div className="funnel-bar-wrap">
                <div
                  className="funnel-bar"
                  style={{ width: `${step.pct}%`, background: FUNNEL_COLORS[i] }}
                />
              </div>
              <div className="funnel-right">
                <span className="funnel-pct">{step.pct}%</span>
                {dropPct && (
                  <span className="funnel-drop">−{dropPct}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
const ACTIVITY_TYPES = {
  error: { icon: AlertTriangle, color: '#ef4444', bg: '#fff1f2' },
  success: { icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb' },
  info: { icon: Activity, color: '#6366f1', bg: '#eef2ff' },
  admin: { icon: Shield, color: '#7c3aed', bg: '#f5f3ff' },
};

const RECENT_EVENTS = [
  { type: 'error', msg: 'Face model processing failed for 3 assessments', time: '2m ago', tag: 'AI Model' },
  { type: 'success', msg: 'Report generation completed — 24 reports exported', time: '8m ago', tag: 'Reports' },
  { type: 'warning', msg: 'Text model latency spike: avg 540ms (threshold: 400ms)', time: '14m ago', tag: 'Performance' },
  { type: 'admin', msg: 'Admin "superadmin" updated AI module configuration', time: '22m ago', tag: 'Admin Action' },
  { type: 'info', msg: 'Voice analysis batch completed: 48 assessments processed', time: '31m ago', tag: 'Processing' },
  { type: 'error', msg: 'Database connection timeout — auto-recovered in 2s', time: '45m ago', tag: 'Database' },
  { type: 'success', msg: 'Scheduled data sync completed successfully', time: '1h ago', tag: 'System' },
  { type: 'warning', msg: 'Unusual error spike detected in questionnaire module', time: '1h 20m ago', tag: 'Alert' },
];

function RecentActivity() {
  return (
    <div className="ov-card" style={{ flex: 1 }}>
      <div className="ov-card-header">
        <div className="ov-card-title"><Activity size={15} /> Recent Platform Activity</div>
        <button className="ov-card-action"><RefreshCw size={13} /> Refresh</button>
      </div>
      <div className="activity-list">
        {RECENT_EVENTS.map((ev, i) => {
          const cfg = ACTIVITY_TYPES[ev.type];
          const Icon = cfg.icon;
          return (
            <div key={i} className="activity-row">
              <div className="activity-icon" style={{ background: cfg.bg }}>
                <Icon size={13} style={{ color: cfg.color }} />
              </div>
              <div className="activity-body">
                <span className="activity-msg">{ev.msg}</span>
                <div className="activity-meta">
                  <span className="activity-tag">{ev.tag}</span>
                  <span className="activity-time"><Clock size={10} /> {ev.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Usage Summary ─────────────────────────────────────────────────────────────
const USAGE_ROWS = [
  { label: 'Avg. Session Duration', value: '12m 34s', delta: '+8%', up: true },
  { label: 'Error Rate (24h)', value: '0.42%', delta: '+0.1%', up: false },
  { label: 'AI Processing Jobs', value: '3,841', delta: '+21%', up: true },
  { label: 'Report Exports', value: '247', delta: '+5%', up: true },
  { label: 'Failed Assessments', value: '11', delta: '-3%', up: true },
  { label: 'New Registrations (today)', value: '38', delta: '+12%', up: true },
  { label: 'Active Admin Sessions', value: '2', delta: '', up: null },
  { label: 'Avg. Concern Score', value: '52 / 100', delta: '-2%', up: false },
];

function UsageSummary() {
  return (
    <div className="ov-card">
      <div className="ov-card-header">
        <div className="ov-card-title"><TrendingUp size={15} /> Usage Summary</div>
      </div>
      <div className="usage-list">
        {USAGE_ROWS.map((r) => (
          <div key={r.label} className="usage-row">
            <span className="usage-label">{r.label}</span>
            <span className="usage-val">{r.value}</span>
            {r.delta && (
              <span className={`usage-delta ${r.up ? 'usage-delta-up' : 'usage-delta-down'}`}>
                {r.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {r.delta}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Concern Distribution ─────────────────────────────────────────────────────
const CONCERNS = [
  { level: 'Low Concern', pct: 45, color: '#10b981', bg: '#ecfdf5', text: '#059669', count: 6560 },
  { level: 'Moderate Concern', pct: 30, color: '#f59e0b', bg: '#fffbeb', text: '#d97706', count: 4378 },
  { level: 'High Concern', pct: 18, color: '#ef4444', bg: '#fff1f2', text: '#e11d48', count: 2627 },
  { level: 'Critical', pct: 7, color: '#7c3aed', bg: '#f5f3ff', text: '#6d28d9', count: 1021 },
];

function ConcernDistribution() {
  return (
    <div className="ov-card">
      <div className="ov-card-header">
        <div className="ov-card-title"><PieChart size={15} /> Concern Distribution</div>
        <span className="ov-card-meta">Last 30 days</span>
      </div>

      {/* Donut */}
      <div className="concern-donut-wrap">
        <svg viewBox="0 0 80 80" width="100" height="100" style={{ display: 'block', margin: '0 auto 12px' }}>
          {(() => {
            let angle = -90;
            return CONCERNS.map((c) => {
              const slice = (c.pct / 100) * 360;
              const r = 32, cx = 40, cy = 40;
              const startRad = (angle * Math.PI) / 180;
              const endRad = ((angle + slice) * Math.PI) / 180;
              const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad);
              const large = slice > 180 ? 1 : 0;
              const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
              angle += slice;
              return <path key={c.level} d={d} fill={c.color} opacity="0.85" />;
            });
          })()}
          <circle cx="40" cy="40" r="20" fill="#fff" />
          <text x="40" y="37" textAnchor="middle" fontSize="8" fontWeight="800" fill="#0f172a">14,586</text>
          <text x="40" y="47" textAnchor="middle" fontSize="6" fill="#94a3b8">total</text>
        </svg>
      </div>

      <div className="concern-bars">
        {CONCERNS.map((c) => (
          <div key={c.level} className="concern-bar-row">
            <div className="concern-bar-top">
              <span className="concern-bar-label" style={{ color: c.text }}>{c.level}</span>
              <span className="concern-bar-count">{c.count.toLocaleString()}</span>
              <span className="concern-bar-pct">{c.pct}%</span>
            </div>
            <div className="concern-bar-track">
              <div className="concern-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="concern-alert-box">
        <AlertTriangle size={14} style={{ color: '#e11d48' }} />
        <div>
          <div className="concern-alert-label">High/Critical Assessments Today</div>
          <div className="concern-alert-val">142 <span className="concern-alert-badge">−5% vs yesterday</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'View Users', icon: Users, href: '/admin/users', color: '#6366f1', bg: '#eef2ff' },
  { label: 'Assessments', icon: FileBarChart, href: '/admin/assessments', color: '#059669', bg: '#ecfdf5' },
  { label: 'AI Modules', icon: Brain, href: '/admin/ai-modules', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Reports', icon: FileText, href: '/admin/reports', color: '#d97706', bg: '#fffbeb' },
];

function QuickActions() {
  return (
    <div className="quick-actions-row">
      {QUICK_ACTIONS.map((a) => (
        <a key={a.label} href={a.href} className="quick-action-chip">
          <span className="quick-action-icon" style={{ background: a.bg }}>
            <a.icon size={14} style={{ color: a.color }} />
          </span>
          {a.label}
        </a>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [activeLines, setActiveLines] = useState(['users', 'activeUsers', 'assessments']);
  const chartData = useMemo(() => buildChartData(dateRange), [dateRange]);

  const kpis = useMemo(() => {
    return {
      users: { value: '12,485', change: '+12.5%', isPositive: true, spark: mockSeries(8000, 10, 0.08), sub: 'vs prev period' },
      activeUsers: { value: '8,192', change: '+5.2%', isPositive: true, spark: mockSeries(5200, 10, 0.10), sub: '65.6% of total' },
      assessments: { value: '145,820', change: '+18.1%', isPositive: true, spark: mockSeries(140000, 10, 0.05), sub: 'all time' },
      today: { value: '1,248', change: '-2.4%', isPositive: false, spark: mockSeries(1300, 10, 0.12), sub: 'today' },
      completion: { value: '94%', change: '+1.1%', isPositive: true, spark: mockSeries(92, 10, 0.02), sub: 'avg. rate' },
    };
  }, []);

  const LINE_TOGGLES = [
    { key: 'users', label: 'Total Users', color: '#6366f1' },
    { key: 'activeUsers', label: 'Active Users', color: '#10b981' },
    { key: 'assessments', label: 'Assessments', color: '#f59e0b' },
  ];

  function toggleLine(key) {
    setActiveLines((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    );
  }

  return (
    <AdminLayout>
      <style>{`
        /* ── Page structure ── */
        .ov-page { display: flex; flex-direction: column; gap: 20px; }

        /* ── Header ── */
        .ov-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .ov-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
        .ov-subtitle { font-size: 13px; color: #94a3b8; margin-top: 3px; }
        .ov-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        /* Date tabs */
        .ov-date-tabs { display: flex; background: #f1f5f9; border-radius: 10px; padding: 3px; gap: 2px; }
        .ov-date-tab {
          padding: 5px 13px; border-radius: 8px; font-size: 12.5px; font-weight: 600;
          border: none; background: transparent; color: #64748b; cursor: pointer; transition: all .14s;
        }
        .ov-date-tab-active { background: #fff; color: #6366f1; box-shadow: 0 1px 4px rgba(15,23,42,.08); font-weight: 700; }

        /* Quick actions */
        .quick-actions-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .quick-action-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 13px 6px 7px; border-radius: 9px;
          border: 1px solid #eaecf0; background: #fff; text-decoration: none;
          font-size: 12.5px; font-weight: 600; color: #475569;
          transition: all .14s; white-space: nowrap;
        }
        .quick-action-chip:hover { border-color: #c7d2fe; background: #fafbff; color: #4338ca; box-shadow: 0 2px 8px rgba(99,102,241,.08); }
        .quick-action-icon {
          width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── KPI Row ── */
        .kpi-row2 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        @media (max-width: 1100px) { .kpi-row2 { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px) { .kpi-row2 { grid-template-columns: repeat(2, 1fr); } }

        .kpi-card2 {
          background: #fff; border: 1px solid #eaecf0; border-radius: 14px;
          padding: 14px 16px; display: flex; flex-direction: column; gap: 4px;
          box-shadow: 0 1px 3px rgba(15,23,42,.04); transition: box-shadow .15s, transform .15s;
        }
        .kpi-card2:hover { box-shadow: 0 4px 14px rgba(99,102,241,.09); transform: translateY(-1px); }
        .kpi2-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .kpi2-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .kpi2-badge {
          display: inline-flex; align-items: center; gap: 2px;
          padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700;
        }
        .kpi2-badge-up { background: #ecfdf5; color: #059669; }
        .kpi2-badge-down { background: #fff1f2; color: #e11d48; }
        .kpi2-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; }
        .kpi2-value { font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.1; }
        .kpi2-sub { font-size: 11px; color: #94a3b8; }
        .kpi2-spark { margin-top: 6px; }

        /* ── Cards ── */
        .ov-card {
          background: #fff; border: 1px solid #eaecf0; border-radius: 14px;
          box-shadow: 0 1px 3px rgba(15,23,42,.04); overflow: hidden;
          display: flex; flex-direction: column;
        }
        .ov-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid #f8fafc;
        }
        .ov-card-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 12.5px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .07em; color: #475569;
        }
        .ov-card-meta { font-size: 11.5px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
        .ov-card-action {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #6366f1;
          background: none; border: none; cursor: pointer;
          padding: 4px 8px; border-radius: 7px; transition: background .12s;
        }
        .ov-card-action:hover { background: #eef2ff; }

        /* ── Row 1: Chart + Concern ── */
        .ov-row1 { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
        @media (max-width: 1050px) { .ov-row1 { grid-template-columns: 1fr; } }

        .chart-card { padding: 0; overflow: visible; }
        .chart-header { padding: 14px 18px; border-bottom: 1px solid #f8fafc; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .chart-toggles { display: flex; gap: 8px; }
        .chart-toggle {
          display: flex; align-items: center; gap: 5px; padding: 4px 10px;
          border-radius: 7px; font-size: 12px; font-weight: 600; border: 1.5px solid;
          cursor: pointer; transition: all .13s; background: #fff;
        }
        .chart-toggle-dot { width: 8px; height: 8px; border-radius: 50%; }
        .chart-body { position: relative; flex: 1; padding: 18px 18px 14px; overflow: visible; }

        /* Tooltip */
        .chart-tooltip {
          position: absolute; top: 8px; transform: translateX(-50%);
          background: #1e293b; border-radius: 10px; padding: 8px 12px;
          font-size: 12px; color: #fff; pointer-events: none; z-index: 10;
          box-shadow: 0 4px 16px rgba(15,23,42,.2); white-space: nowrap;
          min-width: 140px;
        }
        .chart-tooltip-label { font-size: 11px; color: #94a3b8; margin-bottom: 5px; font-weight: 600; }
        .chart-tooltip-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
        .chart-tooltip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .chart-tooltip-name { color: #cbd5e1; flex: 1; font-size: 11.5px; }
        .chart-tooltip-val { font-weight: 700; font-size: 12px; }

        /* ── Concern ── */
        .concern-donut-wrap { padding: 12px 18px 0; }
        .concern-bars { padding: 4px 18px 0; display: flex; flex-direction: column; gap: 10px; }
        .concern-bar-row { display: flex; flex-direction: column; gap: 4px; }
        .concern-bar-top { display: flex; align-items: center; gap: 4px; }
        .concern-bar-label { font-size: 12px; font-weight: 600; flex: 1; }
        .concern-bar-count { font-size: 11px; color: #64748b; font-weight: 500; }
        .concern-bar-pct { font-size: 11px; font-weight: 700; color: #334155; min-width: 30px; text-align: right; }
        .concern-bar-track { height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .concern-bar-fill { height: 100%; border-radius: 99px; transition: width .4s; }
        .concern-alert-box {
          display: flex; align-items: flex-start; gap: 10px;
          margin: 14px 18px 18px; padding: 12px 14px;
          background: #fff1f2; border: 1px solid #fecaca; border-radius: 10px;
        }
        .concern-alert-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
        .concern-alert-val { font-size: 18px; font-weight: 800; color: #e11d48; display: flex; align-items: center; gap: 7px; margin-top: 2px; }
        .concern-alert-badge { font-size: 11px; font-weight: 700; background: #fff; color: #e11d48; border-radius: 6px; padding: 2px 7px; border: 1px solid #fecaca; }

        /* ── Row 2: Funnel + Health ── */
        .ov-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 900px) { .ov-row2 { grid-template-columns: 1fr; } }

        /* Funnel */
        .funnel-list { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; }
        .funnel-row { display: grid; grid-template-columns: 130px 1fr 70px; align-items: center; gap: 10px; }
        .funnel-meta { display: flex; flex-direction: column; }
        .funnel-label { font-size: 12px; font-weight: 600; color: #334155; }
        .funnel-val { font-size: 11px; color: #94a3b8; }
        .funnel-bar-wrap { height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .funnel-bar { height: 100%; border-radius: 99px; transition: width .5s; opacity: 0.85; }
        .funnel-right { display: flex; flex-direction: column; align-items: flex-end; }
        .funnel-pct { font-size: 12px; font-weight: 700; color: #334155; }
        .funnel-drop { font-size: 10.5px; color: #ef4444; font-weight: 600; }

        /* Health */
        .health-list { padding: 8px 14px 14px; display: flex; flex-direction: column; gap: 4px; }
        .health-row {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 8px; border-radius: 9px; transition: background .12s;
        }
        .health-row:hover { background: #f8fafc; }
        .health-icon-wrap { width: 28px; height: 28px; border-radius: 7px; background: #f8fafc; border: 1px solid #eaecf0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .health-name { font-size: 12.5px; font-weight: 600; color: #334155; flex: 1; }
        .health-latency { font-size: 11px; color: #94a3b8; font-weight: 500; min-width: 40px; text-align: right; }
        .health-badge {
          display: flex; align-items: center; gap: 5px; padding: 3px 9px;
          border-radius: 99px; font-size: 11px; font-weight: 700; white-space: nowrap;
        }
        .health-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── Row 3: Activity + Usage ── */
        .ov-row3 { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
        @media (max-width: 1050px) { .ov-row3 { grid-template-columns: 1fr; } }

        /* Activity */
        .activity-list { padding: 8px 14px 14px; display: flex; flex-direction: column; gap: 2px; }
        .activity-row { display: flex; align-items: flex-start; gap: 10px; padding: 9px 6px; border-radius: 9px; transition: background .12s; }
        .activity-row:hover { background: #f8fafc; }
        .activity-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .activity-body { flex: 1; min-width: 0; }
        .activity-msg { font-size: 12.5px; font-weight: 500; color: #334155; display: block; }
        .activity-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
        .activity-tag { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; background: #f1f5f9; border-radius: 5px; padding: 2px 6px; }
        .activity-time { font-size: 11px; color: #b0b8c8; display: flex; align-items: center; gap: 3px; }

        /* Usage */
        .usage-list { padding: 6px 18px 14px; display: flex; flex-direction: column; }
        .usage-row { display: flex; align-items: center; gap: 8px; padding: 9px 0; border-bottom: 1px solid #f8fafc; }
        .usage-row:last-child { border-bottom: none; }
        .usage-label { font-size: 12.5px; color: #64748b; font-weight: 500; flex: 1; }
        .usage-val { font-size: 13px; font-weight: 700; color: #1e293b; }
        .usage-delta { display: flex; align-items: center; gap: 2px; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; }
        .usage-delta-up { background: #ecfdf5; color: #059669; }
        .usage-delta-down { background: #fff1f2; color: #e11d48; }
      `}</style>

      <div className="ov-page">

        {/* Header */}
        <div className="ov-header">
          <div>
            <h1 className="ov-title">Platform Overview</h1>
            <p className="ov-subtitle">Monitor MindSense AI platform metrics and user activity.</p>
          </div>
          <div className="ov-header-right">
            <QuickActions />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* KPI Row */}
        <div className="kpi-row2">
          <KpiCard icon={Users} label="Total Users" value={kpis.users.value} change={kpis.users.change} isPositive={kpis.users.isPositive} spark={kpis.users.spark} color="indigo" sub="vs prev period" />
          <KpiCard icon={UserCheck} label="Active Users" value={kpis.activeUsers.value} change={kpis.activeUsers.change} isPositive={kpis.activeUsers.isPositive} spark={kpis.activeUsers.spark} color="emerald" sub="65.6% of total" />
          <KpiCard icon={FileBarChart} label="Total Assessments" value={kpis.assessments.value} change={kpis.assessments.change} isPositive={kpis.assessments.isPositive} spark={kpis.assessments.spark} color="violet" sub="all time" />
          <KpiCard icon={Activity} label="Assessments Today" value={kpis.today.value} change={kpis.today.change} isPositive={kpis.today.isPositive} spark={kpis.today.spark} color="amber" sub="today" />
          <KpiCard icon={Target} label="Avg. Completion" value={kpis.completion.value} change={kpis.completion.change} isPositive={kpis.completion.isPositive} spark={kpis.completion.spark} color="emerald" sub="avg. rate" />
        </div>

        {/* Row 1: Chart + Concern */}
        <div className="ov-row1">
          {/* Chart */}
          <div className="ov-card chart-card">
            <div className="chart-header">
              <div className="ov-card-title"><TrendingUp size={15} /> User Growth & Activity</div>
              <div className="chart-toggles">
                {LINE_TOGGLES.map((t) => {
                  const on = activeLines.includes(t.key);
                  return (
                    <button
                      key={t.key}
                      className="chart-toggle"
                      style={{
                        borderColor: on ? t.color : '#e2e8f0',
                        color: on ? t.color : '#94a3b8',
                        background: on ? `${t.color}10` : '#fff',
                      }}
                      onClick={() => toggleLine(t.key)}
                    >
                      <span className="chart-toggle-dot" style={{ background: on ? t.color : '#cbd5e1' }} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="chart-body">
              <AreaChart data={chartData} activeLines={activeLines} />
            </div>
          </div>

          {/* Concern Distribution */}
          <ConcernDistribution />
        </div>

        {/* Row 2: Funnel + System Health */}
        <div className="ov-row2">
          <AssessmentFunnel />
          <SystemHealth />
        </div>

        {/* Row 3: Activity + Usage */}
        <div className="ov-row3">
          <RecentActivity />
          <UsageSummary />
        </div>

      </div>
    </AdminLayout>
  );
}
