import React from 'react';
import { Clock3 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminComingSoonPage({ title }) {
  return (
    <AdminLayout>
      <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Clock3 className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-900">{title}</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Coming soon.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
