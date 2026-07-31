import React from 'react';
import { Clock3, Construction } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminComingSoonPage({ title }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">This admin section is not available yet.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Construction className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">Module pending</h2>
                <p className="mt-0.5 text-xs font-medium text-slate-500">The page route is ready, but the feature UI has not been built.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
              <Clock3 className="h-3.5 w-3.5" />
              Coming soon
            </span>
          </div>

          <div className="px-6 py-10">
            <div className="max-w-2xl">
              <p className="text-sm leading-6 text-slate-600">
                Work for this area has not started yet. Use the available admin sections from the sidebar until this module is implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
