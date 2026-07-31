import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings2, Sliders, Shield, ToggleLeft, Save } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
    <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Toggle = ({ label, description, defaultChecked = true }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
      <div>
        <div className="font-semibold text-sm text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
};

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure AI thresholds, weights, and global platform features.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        <div>
          <SettingsSection title="Concern Thresholds" icon={Settings2}>
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Critical Concern Threshold</span>
                  <span className="text-rose-600 font-bold">85+</span>
                </label>
                <input type="range" min="0" max="100" defaultValue="85" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600" />
                <p className="text-xs text-slate-500 mt-2">Scores above this trigger immediate crisis resources.</p>
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>High Concern Threshold</span>
                  <span className="text-orange-600 font-bold">70 - 84</span>
                </label>
                <input type="range" min="0" max="100" defaultValue="70" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                <p className="text-xs text-slate-500 mt-2">Scores in this range recommend scheduling a session.</p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Multimodal AI Weights" icon={Sliders}>
            <p className="text-xs text-slate-500 mb-6">Adjust how much each signal influences the final unified Assessment Score.</p>
            <div className="space-y-4">
              {[
                { label: "Behavioural Data Weight", val: "20%", color: "accent-indigo-600" },
                { label: "Text & Chat Weight", val: "30%", color: "accent-blue-600" },
                { label: "Facial Expression Weight", val: "25%", color: "accent-purple-600" },
                { label: "Voice Patterns Weight", val: "25%", color: "accent-cyan-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-40 text-sm font-medium text-slate-700">{item.label}</div>
                  <input type="range" min="0" max="100" defaultValue={parseInt(item.val)} className={`flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${item.color}`} />
                  <div className="w-12 text-right text-sm font-bold text-slate-900">{item.val}</div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-slate-800">Total Weight</span>
                <span className="text-sm font-bold text-emerald-600">100%</span>
              </div>
            </div>
          </SettingsSection>
        </div>

        <div>
          <SettingsSection title="Feature Toggles" icon={ToggleLeft}>
            <Toggle 
              label="MindSense Companion (Chatbot)" 
              description="Allow users to interact with the conversational AI."
            />
            <Toggle 
              label="Real-time Voice Analysis" 
              description="Process voice data continuously during check-ins."
              defaultChecked={false}
            />
            <Toggle 
              label="Automated Weekly Reports" 
              description="Send automated PDF reports to users every Sunday."
            />
            <Toggle 
              label="Emergency Contacts Integration" 
              description="Allow users to add trusted contacts for critical alerts."
            />
          </SettingsSection>

          <SettingsSection title="Security & OTP" icon={Shield}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">OTP Expiry (Minutes)</label>
                <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Failed Login Attempts</label>
                <input type="number" defaultValue="3" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="pt-2">
                <Toggle 
                  label="Require MFA for Admins" 
                  description="Enforce Multi-Factor Authentication for all dashboard access."
                />
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </AdminLayout>
  );
}
