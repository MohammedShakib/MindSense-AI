import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GoogleLoadingOverlay({ loading }) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-indigo-100 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
        Connecting to Google...
      </div>
    </div>
  );
}
