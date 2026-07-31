import React, { useEffect, useMemo, useRef, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  SlidersHorizontal,
  Users,
  X,
  XCircle,
  Activity,
  Brain,
  Calendar,
  Clock,
  AlertTriangle,
  Eye,
  UserX,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { fetchAdminUsers } from '../../lib/api';

let cachedAdminUsers = null;
const ITEMS_PER_PAGE = 10;

function getDisplayName(user) {
  if (user.name) return user.name;
  if (!user.email) return 'Unnamed User';
  return (
    user.email
      .split('@')[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Unnamed User'
  );
}

function getInitials(name) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateShort(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function downloadUsersCsv(users) {
  const rows = [
    ['Name', 'Email', 'Provider', 'Registered', 'Assessments', 'Status'],
    ...users.map((user) => [
      getDisplayName(user),
      user.email || '',
      user.provider || 'Email',
      user.registered_at || '',
      user.assessment_count ?? 0,
      user.status || 'Inactive',
    ]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mindsense-users.csv';
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ['#6366f1', '#eef2ff'],
  ['#8b5cf6', '#f5f3ff'],
  ['#0ea5e9', '#e0f2fe'],
  ['#10b981', '#ecfdf5'],
  ['#f59e0b', '#fffbeb'],
  ['#ef4444', '#fef2f2'],
  ['#ec4899', '#fdf2f8'],
];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function UserAvatar({ user, size = 32 }) {
  const name = getDisplayName(user);
  const [fg, bg] = avatarColor(name);
  if (user.profile_picture) {
    return (
      <img
        src={user.profile_picture}
        alt=""
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-white"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
      className="flex shrink-0 items-center justify-center rounded-full font-bold ring-2 ring-white"
    >
      {getInitials(name)}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, color, sub }) {
  const colorMap = {
    indigo: { bg: '#eef2ff', fg: '#6366f1', badge: '#c7d2fe' },
    violet: { bg: '#f5f3ff', fg: '#7c3aed', badge: '#ddd6fe' },
    sky: { bg: '#e0f2fe', fg: '#0284c7', badge: '#bae6fd' },
    emerald: { bg: '#ecfdf5', fg: '#059669', badge: '#a7f3d0' },
  };
  const c = colorMap[color] || colorMap.indigo;
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: c.bg }}>
        <Icon size={18} style={{ color: c.fg }} />
      </div>
      <div className="kpi-body">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value ?? '—'}</span>
        {sub && <span className="kpi-sub">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
      {isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
      {status || 'Inactive'}
    </span>
  );
}

// ─── Provider Badge ───────────────────────────────────────────────────────────
function ProviderBadge({ provider }) {
  const isGoogle = provider === 'Google';
  return (
    <span className={`provider-badge ${isGoogle ? 'provider-google' : 'provider-email'}`}>
      {isGoogle ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ) : (
        <Mail size={11} />
      )}
      {provider || 'Email'}
    </span>
  );
}

// ─── 3-dot Action Menu ────────────────────────────────────────────────────────
function ActionMenu({ user, onViewProfile, onToggleStatus }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const isActive = user.status === 'Active';

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="action-menu-wrap" ref={menuRef}>
      <button
        className="action-dot-btn"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        aria-label="User actions"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="action-dropdown">
          <button
            className="action-item"
            onClick={() => { setOpen(false); onViewProfile(user); }}
          >
            <Eye size={14} /> View Profile
          </button>
          <div className="action-divider" />
          <button
            className={`action-item ${isActive ? 'action-item-danger' : 'action-item-success'}`}
            onClick={() => { setOpen(false); onToggleStatus(user); }}
          >
            {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
            {isActive ? 'Deactivate User' : 'Activate User'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Filter Drawer ─────────────────────────────────────────────────────────────
function FilterDrawer({ open, onClose, filters, onChange }) {
  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <div className={`filter-drawer ${open ? 'filter-drawer-open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title"><SlidersHorizontal size={16} /> Filters</span>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="drawer-body">
          <label className="filter-label">Provider</label>
          <div className="filter-chips">
            {['All', 'Google', 'Email'].map((p) => (
              <button
                key={p}
                className={`filter-chip ${filters.provider === p ? 'filter-chip-active' : ''}`}
                onClick={() => onChange({ ...filters, provider: p })}
              >{p}</button>
            ))}
          </div>

          <label className="filter-label">Status</label>
          <div className="filter-chips">
            {['All', 'Active', 'Inactive'].map((s) => (
              <button
                key={s}
                className={`filter-chip ${filters.status === s ? 'filter-chip-active' : ''}`}
                onClick={() => onChange({ ...filters, status: s })}
              >{s}</button>
            ))}
          </div>

          <label className="filter-label">Min Assessments</label>
          <input
            type="number"
            min={0}
            className="filter-input"
            value={filters.minAssessments}
            onChange={(e) => onChange({ ...filters, minAssessments: e.target.value })}
            placeholder="e.g. 1"
          />
        </div>
        <div className="drawer-footer">
          <button
            className="filter-reset-btn"
            onClick={() => onChange({ provider: 'All', status: 'All', minAssessments: '' })}
          >Reset Filters</button>
          <button className="filter-apply-btn" onClick={onClose}>Apply</button>
        </div>
      </div>
    </>
  );
}

// ─── Profile Drawer ───────────────────────────────────────────────────────────
function ProfileDrawer({ user, onClose, onToggleStatus }) {
  if (!user) return null;
  const name = getDisplayName(user);
  const isActive = user.status === 'Active';

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="profile-drawer profile-drawer-open">
        <div className="drawer-header">
          <span className="drawer-title">User Profile</span>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="drawer-body">
          {/* Avatar + Name */}
          <div className="profile-hero">
            <UserAvatar user={user} size={64} />
            <div>
              <div className="profile-name">{name}</div>
              <div className="profile-email"><Mail size={13} />{user.email}</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label"><Shield size={13} />Provider</span>
              <ProviderBadge provider={user.provider} />
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label"><Activity size={13} />Status</span>
              <StatusBadge status={user.status} />
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label"><Calendar size={13} />Registered</span>
              <span className="profile-info-value">{formatDate(user.registered_at)}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label"><Clock size={13} />Last Active</span>
              <span className="profile-info-value">{formatDate(user.last_active) || 'N/A'}</span>
            </div>
          </div>

          {/* Assessment Stats */}
          <div className="profile-stat-box">
            <div className="profile-stat">
              <Brain size={18} style={{ color: '#6366f1' }} />
              <div>
                <div className="profile-stat-val">{user.assessment_count ?? 0}</div>
                <div className="profile-stat-label">Total Assessments</div>
              </div>
            </div>
            {user.latest_score != null && (
              <div className="profile-stat">
                <TrendingUp size={18} style={{ color: '#10b981' }} />
                <div>
                  <div className="profile-stat-val">{user.latest_score}</div>
                  <div className="profile-stat-label">Latest Score</div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button
              className={`profile-action-btn ${isActive ? 'profile-action-danger' : 'profile-action-success'}`}
              onClick={() => onToggleStatus(user)}
            >
              {isActive ? <><UserX size={15} /> Deactivate User</> : <><UserCheck size={15} /> Activate User</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Bulk Actions Bar ─────────────────────────────────────────────────────────
function BulkActionsBar({ count, onActivate, onDeactivate, onExport, onClear }) {
  return (
    <div className="bulk-bar">
      <span className="bulk-count">{count} selected</span>
      <div className="bulk-actions">
        <button className="bulk-btn bulk-btn-success" onClick={onActivate}><UserCheck size={14} />Activate</button>
        <button className="bulk-btn bulk-btn-danger" onClick={onDeactivate}><UserX size={14} />Deactivate</button>
        <button className="bulk-btn" onClick={onExport}><Download size={14} />Export</button>
        <button className="bulk-btn-clear" onClick={onClear}><X size={14} /></button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [usersLoading, setUsersLoading] = useState(!cachedAdminUsers);
  const [usersError, setUsersError] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filters, setFilters] = useState({ provider: 'All', status: 'All', minAssessments: '' });

  async function loadAdminData({ force = false } = {}) {
    if (!force && cachedAdminUsers) {
      setUsers(cachedAdminUsers);
      setUsersLoading(false);
      return;
    }
    setUsersLoading(true);
    setUsersError('');
    try {
      const nextUsers = await fetchAdminUsers();
      cachedAdminUsers = nextUsers;
      setUsers(nextUsers);
    } catch (err) {
      setUsersError(err.message || 'Failed to load admin users');
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (cachedAdminUsers) {
      setUsers(cachedAdminUsers);
      setUsersLoading(false);
      return;
    }
    loadAdminData();
  }, []);

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [query, filters]);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((u) => {
      if (term) {
        const name = getDisplayName(u).toLowerCase();
        const email = (u.email || '').toLowerCase();
        if (!name.includes(term) && !email.includes(term)) return false;
      }
      if (filters.provider !== 'All' && (u.provider || 'Email') !== filters.provider) return false;
      if (filters.status !== 'All' && u.status !== filters.status) return false;
      if (filters.minAssessments !== '' && (u.assessment_count ?? 0) < Number(filters.minAssessments)) return false;
      return true;
    });
  }, [query, users, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const pagedUsers = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // KPI values
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const googleUsers = users.filter((u) => u.provider === 'Google').length;
  const totalAssessments = users.reduce((s, u) => s + (u.assessment_count ?? 0), 0);

  // Bulk select helpers
  const allPageSelected = pagedUsers.length > 0 && pagedUsers.every((u) => selectedIds.has(u.id));
  const somePageSelected = pagedUsers.some((u) => selectedIds.has(u.id));
  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pagedUsers.forEach((u) => next.delete(u.id));
      else pagedUsers.forEach((u) => next.add(u.id));
      return next;
    });
  }
  function toggleSelectOne(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleToggleStatus(user) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
    cachedAdminUsers = null;
    if (profileUser?.id === user.id) {
      setProfileUser((u) => ({ ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }));
    }
  }

  function handleBulkActivate() {
    setUsers((prev) => prev.map((u) => selectedIds.has(u.id) ? { ...u, status: 'Active' } : u));
    setSelectedIds(new Set());
  }
  function handleBulkDeactivate() {
    setUsers((prev) => prev.map((u) => selectedIds.has(u.id) ? { ...u, status: 'Inactive' } : u));
    setSelectedIds(new Set());
  }
  function handleBulkExport() {
    const sel = users.filter((u) => selectedIds.has(u.id));
    downloadUsersCsv(sel);
  }

  const hasActiveFilters = filters.provider !== 'All' || filters.status !== 'All' || filters.minAssessments !== '';

  // Pagination
  function pageRange() {
    const range = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    if (left > 1) { range.push(1); if (left > 2) range.push('...'); }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) { if (right < totalPages - 1) range.push('...'); range.push(totalPages); }
    return range;
  }

  return (
    <AdminLayout>
      <style>{`
        /* ── KPI Cards ── */
        .kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 20px; }
        @media (max-width: 900px) { .kpi-row { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .kpi-row { grid-template-columns: 1fr; } }
        .kpi-card {
          background: #fff; border: 1px solid #e8eaf0; border-radius: 14px;
          padding: 16px 18px; display: flex; align-items: center; gap: 14px;
          box-shadow: 0 1px 4px rgba(15,23,42,.05);
          transition: box-shadow .15s, transform .15s;
        }
        .kpi-card:hover { box-shadow: 0 4px 16px rgba(99,102,241,.10); transform: translateY(-1px); }
        .kpi-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .kpi-body { display: flex; flex-direction: column; gap: 1px; }
        .kpi-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; }
        .kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.1; }
        .kpi-sub { font-size: 11px; color: #64748b; }

        /* ── Page header ── */
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
        .page-subtitle { font-size: 13px; color: #94a3b8; margin-top: 3px; }
        .header-actions { display: flex; gap: 8px; align-items: center; }
        .btn-export {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: 1px solid #e2e8f0; background: #fff; color: #475569;
          cursor: pointer; transition: all .15s;
        }
        .btn-export:hover { background: #f8fafc; border-color: #cbd5e1; color: #334155; }

        /* ── Toolbar ── */
        .toolbar {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
          background: #fafbfc; border-radius: 14px 14px 0 0;
        }
        .toolbar-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }
        .toolbar-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .toolbar-search {
          width: 100%; padding: 7px 12px 7px 34px; font-size: 13px;
          border: 1px solid #e2e8f0; border-radius: 9px; background: #fff;
          color: #334155; outline: none; transition: all .15s;
        }
        .toolbar-search:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .toolbar-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 13px; border-radius: 9px; font-size: 13px; font-weight: 600;
          border: 1px solid #e2e8f0; background: #fff; color: #475569;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .toolbar-btn:hover { background: #f1f5f9; color: #334155; }
        .toolbar-btn-active { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
        .toolbar-spacer { flex: 1; }

        /* ── Table container ── */
        .table-wrap {
          background: #fff; border: 1px solid #e8eaf0; border-radius: 14px;
          box-shadow: 0 1px 4px rgba(15,23,42,.05); overflow: hidden;
        }
        .table-scroll { overflow-x: auto; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table thead { position: sticky; top: 0; z-index: 2; }
        .users-table thead tr { background: #f8fafc; }
        .users-table th {
          padding: 10px 14px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .07em; color: #94a3b8;
          text-align: left; border-bottom: 1px solid #f1f5f9; white-space: nowrap;
        }
        .users-table th.center { text-align: center; }
        .users-table th.right { text-align: right; }
        .users-table tbody tr {
          border-bottom: 1px solid #f8fafc; cursor: pointer;
          transition: background .12s;
        }
        .users-table tbody tr:last-child { border-bottom: none; }
        .users-table tbody tr:hover { background: #f8fafc; }
        .users-table td { padding: 9px 14px; vertical-align: middle; }
        .users-table td.center { text-align: center; }
        .users-table td.right { text-align: right; }

        /* checkbox col */
        .col-check { width: 40px; }
        .row-checkbox {
          width: 15px; height: 15px; accent-color: #6366f1; cursor: pointer;
          border-radius: 4px;
        }

        /* User cell */
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-info { display: flex; flex-direction: column; gap: 1px; }
        .user-name { font-size: 13px; font-weight: 700; color: #1e293b; }
        .user-email { font-size: 11.5px; color: #94a3b8; display: flex; align-items: center; gap: 3px; }

        /* Badges */
        .status-badge, .provider-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 99px; font-size: 11.5px; font-weight: 600;
          white-space: nowrap;
        }
        .status-active { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .status-inactive { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .provider-google { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .provider-email { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

        /* Assessment count */
        .assess-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 8px;
          background: #f1f5f9; color: #334155; font-size: 13px; font-weight: 700;
        }

        /* Action menu */
        .action-menu-wrap { position: relative; display: inline-block; }
        .action-dot-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          border: 1px solid transparent; background: transparent; cursor: pointer;
          color: #94a3b8; transition: all .12s;
        }
        .action-dot-btn:hover { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }
        .action-dropdown {
          position: absolute; right: 0; top: calc(100% + 4px); z-index: 100;
          background: #fff; border: 1px solid #e8eaf0; border-radius: 11px;
          box-shadow: 0 8px 30px rgba(15,23,42,.12); min-width: 168px; overflow: hidden;
          animation: dropIn .12s ease;
        }
        @keyframes dropIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
        .action-item {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 9px 14px; font-size: 13px; font-weight: 600;
          color: #475569; background: transparent; border: none; cursor: pointer;
          transition: background .1s;
        }
        .action-item:hover { background: #f8fafc; color: #1e293b; }
        .action-item-danger { color: #dc2626; }
        .action-item-danger:hover { background: #fff5f5; color: #b91c1c; }
        .action-item-success { color: #059669; }
        .action-item-success:hover { background: #f0fdf4; color: #047857; }
        .action-divider { height: 1px; background: #f1f5f9; margin: 3px 0; }

        /* ── Drawers ── */
        .drawer-backdrop {
          position: fixed; inset: 0; background: rgba(15,23,42,.35);
          backdrop-filter: blur(2px); z-index: 200; animation: fadeIn .2s;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .filter-drawer, .profile-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 201;
          background: #fff; display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(15,23,42,.14);
          transform: translateX(100%); transition: transform .25s cubic-bezier(.4,0,.2,1);
          border-left: 1px solid #e8eaf0;
        }
        .filter-drawer { width: 320px; }
        .profile-drawer { width: 360px; }
        .filter-drawer-open, .profile-drawer-open { transform: translateX(0); }
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
        }
        .drawer-title { font-size: 15px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        .drawer-close {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; color: #94a3b8; cursor: pointer; transition: all .12s;
        }
        .drawer-close:hover { background: #f8fafc; color: #475569; }
        .drawer-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 18px; }
        .drawer-footer { padding: 16px 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; }

        /* Filter drawer */
        .filter-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #94a3b8; display: block; margin-bottom: 8px; }
        .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
        .filter-chip {
          padding: 5px 13px; border-radius: 99px; font-size: 12px; font-weight: 600;
          border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; transition: all .12s;
        }
        .filter-chip:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
        .filter-chip-active { border-color: #6366f1 !important; background: #eef2ff !important; color: #6366f1 !important; }
        .filter-input {
          width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 9px;
          font-size: 13px; color: #334155; outline: none; transition: all .15s;
        }
        .filter-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .filter-reset-btn {
          flex: 1; padding: 8px; border-radius: 9px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer;
        }
        .filter-reset-btn:hover { background: #f8fafc; }
        .filter-apply-btn {
          flex: 1; padding: 8px; border-radius: 9px; border: none;
          background: #6366f1; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
          transition: background .15s;
        }
        .filter-apply-btn:hover { background: #4f46e5; }

        /* Profile drawer */
        .profile-hero { display: flex; align-items: center; gap: 14px; }
        .profile-name { font-size: 17px; font-weight: 800; color: #1e293b; }
        .profile-email { font-size: 12.5px; color: #94a3b8; display: flex; align-items: center; gap: 5px; margin-top: 3px; }
        .profile-info-grid { display: flex; flex-direction: column; gap: 0; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        .profile-info-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border-bottom: 1px solid #f8fafc;
        }
        .profile-info-item:last-child { border-bottom: none; }
        .profile-info-label { font-size: 12px; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 5px; }
        .profile-info-value { font-size: 13px; font-weight: 600; color: #334155; }
        .profile-stat-box {
          display: flex; gap: 12px; background: #f8fafc;
          border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 16px;
        }
        .profile-stat { display: flex; align-items: center; gap: 10px; flex: 1; }
        .profile-stat-val { font-size: 20px; font-weight: 800; color: #0f172a; }
        .profile-stat-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
        .profile-actions { display: flex; flex-direction: column; gap: 8px; }
        .profile-action-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; transition: all .15s; width: 100%;
        }
        .profile-action-danger { background: #fff5f5; color: #dc2626; border: 1px solid #fecaca; }
        .profile-action-danger:hover { background: #fee2e2; color: #b91c1c; }
        .profile-action-success { background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0; }
        .profile-action-success:hover { background: #dcfce7; color: #047857; }

        /* ── Bulk bar ── */
        .bulk-bar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          padding: 10px 16px; background: #eef2ff; border-bottom: 1px solid #c7d2fe;
        }
        .bulk-count { font-size: 13px; font-weight: 700; color: #4338ca; }
        .bulk-actions { display: flex; gap: 6px; align-items: center; }
        .bulk-btn {
          display: flex; align-items: center; gap: 5px; padding: 5px 12px;
          border-radius: 8px; font-size: 12px; font-weight: 700;
          border: 1px solid #c7d2fe; background: #fff; color: #4338ca; cursor: pointer;
          transition: all .12s;
        }
        .bulk-btn:hover { background: #eef2ff; }
        .bulk-btn-success { color: #059669; border-color: #a7f3d0; }
        .bulk-btn-success:hover { background: #ecfdf5; }
        .bulk-btn-danger { color: #dc2626; border-color: #fecaca; }
        .bulk-btn-danger:hover { background: #fff5f5; }
        .bulk-btn-clear {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #c7d2fe;
          background: transparent; color: #6366f1; cursor: pointer; transition: all .12s;
        }
        .bulk-btn-clear:hover { background: #eef2ff; }

        /* ── Table footer / pagination ── */
        .table-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-top: 1px solid #f1f5f9; background: #fafbfc;
          flex-wrap: wrap; gap: 8px;
        }
        .table-count { font-size: 12.5px; color: #94a3b8; font-weight: 500; }
        .pagination { display: flex; align-items: center; gap: 4px; }
        .page-btn {
          min-width: 32px; height: 32px; padding: 0 6px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; font-size: 13px; font-weight: 600;
          border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer;
          transition: all .12s;
        }
        .page-btn:hover:not(:disabled) { background: #f1f5f9; color: #1e293b; }
        .page-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .page-btn-active { background: #6366f1 !important; color: #fff !important; border-color: #6366f1 !important; }
        .page-ellipsis { min-width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #94a3b8; }

        /* ── Empty / loading ── */
        .table-empty { padding: 48px 24px; text-align: center; color: #94a3b8; font-size: 14px; }
        .table-error { padding: 32px; text-align: center; color: #dc2626; font-size: 14px; }
        .table-error-inner { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage platform users from the connected database.</p>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={() => downloadUsersCsv(filteredUsers)}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-row">
        <KpiCard icon={Users} label="Total Users" value={totalUsers} color="indigo" />
        <KpiCard icon={Activity} label="Active Users" value={activeUsers} color="emerald" sub={`${totalUsers ? Math.round((activeUsers/totalUsers)*100) : 0}% of total`} />
        <KpiCard icon={Shield} label="Google Users" value={googleUsers} color="sky" />
        <KpiCard icon={Brain} label="Total Assessments" value={totalAssessments} color="violet" />
      </div>

      {/* Table Card */}
      <div className="table-wrap">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-search-wrap">
            <Search className="toolbar-search-icon" size={14} />
            <input
              type="text"
              className="toolbar-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
            />
          </div>

          <button
            className={`toolbar-btn ${hasActiveFilters ? 'toolbar-btn-active' : ''}`}
            onClick={() => setFilterOpen(true)}
          >
            <Filter size={14} />
            Filter
            {hasActiveFilters && <span style={{ background:'#6366f1', color:'#fff', borderRadius:'99px', padding:'1px 6px', fontSize:'10px', fontWeight:800 }}>ON</span>}
          </button>

          <button
            className="toolbar-btn"
            onClick={() => loadAdminData({ force: true })}
            title="Refresh"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <BulkActionsBar
            count={selectedIds.size}
            onActivate={handleBulkActivate}
            onDeactivate={handleBulkDeactivate}
            onExport={handleBulkExport}
            onClear={() => setSelectedIds(new Set())}
          />
        )}

        {/* Table */}
        <div className="table-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th className="col-check">
                  <input
                    type="checkbox"
                    className="row-checkbox"
                    checked={allPageSelected}
                    ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>User</th>
                <th>Provider</th>
                <th>Registered</th>
                <th className="center">Assessments</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading && (
                <tr><td colSpan={7} className="table-empty">Loading users from database…</td></tr>
              )}
              {!usersLoading && usersError && (
                <tr><td colSpan={7} className="table-error"><div className="table-error-inner"><AlertTriangle size={16} />{usersError}</div></td></tr>
              )}
              {!usersLoading && !usersError && filteredUsers.length === 0 && (
                <tr><td colSpan={7} className="table-empty">No users found.</td></tr>
              )}
              {!usersLoading && !usersError && pagedUsers.map((user) => {
                const name = getDisplayName(user);
                const checked = selectedIds.has(user.id);
                return (
                  <tr
                    key={user.id}
                    onClick={() => setProfileUser(user)}
                  >
                    <td className="col-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="row-checkbox"
                        checked={checked}
                        onChange={() => toggleSelectOne(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <UserAvatar user={user} size={32} />
                        <div className="user-info">
                          <span className="user-name">{name}</span>
                          <span className="user-email">
                            <Mail size={11} />{user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><ProviderBadge provider={user.provider} /></td>
                    <td style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500 }}>{formatDateShort(user.registered_at)}</td>
                    <td className="center"><span className="assess-count">{user.assessment_count ?? 0}</span></td>
                    <td><StatusBadge status={user.status} /></td>
                    <td className="right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        user={user}
                        onViewProfile={setProfileUser}
                        onToggleStatus={handleToggleStatus}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="table-footer">
          <span className="table-count">
            Showing {filteredUsers.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            {pageRange().map((p, i) =>
              p === '...' ? (
                <span key={`e${i}`} className="page-ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'page-btn-active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
      />

      {/* Profile Drawer */}
      {profileUser && (
        <ProfileDrawer
          user={profileUser}
          onClose={() => setProfileUser(null)}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </AdminLayout>
  );
}
