import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  CheckCircle2,
  Database,
  Filter,
  Mail,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import { fetchAdminUsers, fetchDatabaseStatus } from '../../lib/api';

function getDisplayName(user) {
  if (user.name) return user.name;
  if (!user.email) return 'Unnamed User';

  return user.email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Unnamed User';
}

function formatDate(value) {
  if (!value) return 'Unknown';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [databaseStatus, setDatabaseStatus] = useState({ connected: false, status: 'checking' });
  const [statusLoading, setStatusLoading] = useState(true);

  async function loadAdminData() {
    setUsersLoading(true);
    setStatusLoading(true);
    setUsersError('');

    try {
      const [nextUsers, nextDatabaseStatus] = await Promise.all([
        fetchAdminUsers(),
        fetchDatabaseStatus(),
      ]);
      setUsers(nextUsers);
      setDatabaseStatus(nextDatabaseStatus);
    } catch (err) {
      setUsersError(err.message || 'Failed to load admin users');
      setDatabaseStatus({ connected: false, status: 'disconnected' });
    } finally {
      setUsersLoading(false);
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return users;

    return users.filter((user) => {
      const name = getDisplayName(user).toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(searchTerm) || email.includes(searchTerm);
    });
  }, [query, users]);

  const isDatabaseConnected = Boolean(databaseStatus.connected);
  const statusLabel = statusLoading
    ? 'Checking'
    : isDatabaseConnected
      ? 'Connected'
      : 'Disconnected';

  return (
    <AdminLayout>
      <div className="mb-6 grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage platform users from the connected database.</p>
          </div>
          <button
            onClick={() => downloadUsersCsv(filteredUsers)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Export Users CSV
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDatabaseConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Database</p>
                <p className="text-sm font-black text-slate-800">{statusLabel}</p>
              </div>
            </div>
            <span className={`h-3 w-3 rounded-full ${isDatabaseConnected ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]' : 'bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.15)]'}`} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/50 p-4 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <button
              onClick={loadAdminData}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Provider</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Registered</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Assessments</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-slate-500">
                    Loading users from database...
                  </td>
                </tr>
              )}

              {!usersLoading && usersError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-rose-600">
                    {usersError}
                  </td>
                </tr>
              )}

              {!usersLoading && !usersError && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-slate-500">
                    No users found in the database.
                  </td>
                </tr>
              )}

              {!usersLoading && !usersError && filteredUsers.map((user) => {
                const displayName = getDisplayName(user);
                const isActive = user.status === 'Active';

                return (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {displayName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-slate-800">{displayName}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {user.provider || 'Email'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(user.registered_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-800">
                        {user.assessment_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isActive ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-600'
                      }`}>
                        {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="rounded px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-800">
                          View Profile
                        </button>
                        <button className={`rounded px-3 py-1.5 text-xs font-bold transition-colors ${
                          isActive ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-800' : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}>
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          <div>Showing {filteredUsers.length} of {users.length} database users</div>
          <div className="flex gap-1">
            <button className="rounded border border-slate-200 bg-white px-3 py-1 opacity-50" disabled>Prev</button>
            <button className="rounded border border-indigo-600 bg-indigo-600 px-3 py-1 text-white">1</button>
            <button className="rounded border border-slate-200 bg-white px-3 py-1 opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
