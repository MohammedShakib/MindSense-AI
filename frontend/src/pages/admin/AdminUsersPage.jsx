import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "Sarah Jenkins", email: "sarah.j@example.com", provider: "Google", regDate: "Oct 24, 2026", assessments: 14, status: "Active" },
    { id: 2, name: "Michael Chen", email: "m.chen@example.com", provider: "Email", regDate: "Oct 22, 2026", assessments: 8, status: "Active" },
    { id: 3, name: "Emma Wilson", email: "emma.w@example.com", provider: "Apple", regDate: "Oct 20, 2026", assessments: 24, status: "Inactive" },
    { id: 4, name: "David Kim", email: "david.kim@example.com", provider: "Google", regDate: "Oct 15, 2026", assessments: 2, status: "Active" },
    { id: 5, name: "Olivia Davis", email: "olivia.d@example.com", provider: "Email", regDate: "Oct 10, 2026", assessments: 45, status: "Active" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage platform users, view profiles, and control access.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Export Users CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Assessments</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {user.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.regDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-800 bg-slate-100 w-8 h-8 rounded-full inline-flex items-center justify-center">
                      {user.assessments}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors">
                        View Profile
                      </button>
                      <button className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                        user.status === 'Active' ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50' : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                      }`}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500 bg-slate-50">
          <div>Showing 1 to 5 of 12,485 entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-indigo-600 rounded bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
