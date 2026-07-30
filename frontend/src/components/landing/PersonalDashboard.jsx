import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, LayoutDashboard, History, TrendingUp, TrendingDown } from 'lucide-react';

export default function PersonalDashboard() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue font-semibold text-sm mb-6">
            <LayoutDashboard className="w-4 h-4" />
            <span>Personal Dashboard</span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Track Your Wellness Journey.<br/>
            <span className="text-slate-600">See the Bigger Picture.</span>
          </motion.h2>
        </div>

        <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          
          {/* Mock Dashboard UI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Left Column: Gauge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-6">Current Status</h3>
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="14" fill="none" />
                  <motion.circle 
                    cx="80" cy="80" r="70" 
                    stroke="url(#lineGradLight)" 
                    strokeWidth="14" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="439.8"
                    initial={{ strokeDashoffset: 439.8 }}
                    whileInView={{ strokeDashoffset: 439.8 * (1 - 0.72) }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">72</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Concern</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">Updated 2 hours ago</p>
            </motion.div>

            {/* Right Column: History & Progress */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-accent-indigo" />
                    Progress History
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <TrendingDown className="w-4 h-4" />
                    Concern decreased by 14%
                  </div>
                </div>
                
                {/* Mock Chart Area */}
                <div className="h-40 w-full flex items-end justify-between gap-2 px-2">
                  {[88, 92, 85, 80, 78, 75, 72].map((height, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2">
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className={`w-full max-w-[40px] rounded-t-md ${i === 6 ? 'bg-accent-blue' : 'bg-slate-200'}`}
                      ></motion.div>
                      <span className="text-[10px] font-bold text-slate-400">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                    <History className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">14</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Assessments</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">7 Day</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Streak</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
