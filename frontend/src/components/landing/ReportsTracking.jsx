import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, ShieldCheck } from 'lucide-react';

export default function ReportsTracking() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex-1 w-full"
          >
            {/* Visual representation of a report */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl relative max-w-sm mx-auto lg:mx-0">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Download className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Wellness Report</h4>
                  <p className="text-xs text-slate-500">October 2026 Summary</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                
                <div className="py-4 my-2 border-y border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Avg. Concern Score</div>
                    <div className="text-2xl font-black text-slate-800">76 / 100</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Trend</div>
                    <div className="text-sm font-bold text-emerald-600">Concern decreased by 4.2%</div>
                  </div>
                </div>

                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-4/5"></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 text-slate-600 font-semibold text-sm mb-6">
              <Calendar className="w-4 h-4" />
              <span>Long-term Tracking</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Reports & Tracking.
            </h2>
            
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Your wellness journey isn't just about today. Keep a secure history of all your assessments and generate beautifully formatted PDF reports for personal records.
            </p>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Exportable PDFs</h4>
                <p className="text-slate-700">Download clean, easy-to-read summaries of your weekly or monthly wellness patterns.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Secure History</h4>
                <p className="text-slate-700">Your historical data is safely encrypted and fully under your control. Delete past records at any time.</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
