import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageCircle, ScanFace, Mic } from 'lucide-react';

const SignalCard = ({ icon: Icon, label, score, delay, x, y, bgClass, textClass }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5, type: "spring" },
      y: { repeat: Infinity, duration: 4, delay: delay * 1.5, ease: "easeInOut" }
    }}
    className="absolute glass-card p-3 flex items-center gap-3 w-40 rounded-xl shadow-lg border-white"
    style={{ left: x, top: y }}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${bgClass}`}>
      <Icon className={`w-5 h-5 ${textClass}`} />
    </div>
    <div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      <div className="text-sm font-bold text-slate-900">{score}</div>
    </div>
  </motion.div>
);

export default function MultimodalVisual() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto mt-12 lg:mt-0 flex items-center justify-center">
      
      {/* Background glow (Light theme) */}
      <div className="absolute inset-0 bg-accent-blue/10 blur-[80px] rounded-full opacity-60"></div>
      
      {/* Abstract connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="lineGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <motion.path 
          d="M 120 120 Q 250 250 250 250" 
          stroke="url(#lineGradLight)" strokeWidth="2.5" strokeDasharray="4 4" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
        />
        <motion.path 
          d="M 380 120 Q 250 250 250 250" 
          stroke="url(#lineGradLight)" strokeWidth="2.5" strokeDasharray="4 4" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.4 }}
        />
        <motion.path 
          d="M 120 380 Q 250 250 250 250" 
          stroke="url(#lineGradLight)" strokeWidth="2.5" strokeDasharray="4 4" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.6 }}
        />
        <motion.path 
          d="M 380 380 Q 250 250 250 250" 
          stroke="url(#lineGradLight)" strokeWidth="2.5" strokeDasharray="4 4" fill="none"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
        />
      </svg>

      {/* Main Center Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-8 w-64 rounded-3xl flex flex-col items-center shadow-2xl border border-white"
      >
        <div className="text-sm text-slate-500 font-semibold mb-6 text-center tracking-wide uppercase">Wellness Insight</div>
        
        {/* Animated Gauge */}
        <div className="relative w-36 h-36 mb-6">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
            <circle cx="72" cy="72" r="64" stroke="#f1f5f9" strokeWidth="12" fill="none" />
            <motion.circle 
              cx="72" cy="72" r="64" 
              stroke="url(#lineGradLight)" 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="402.12" /* 2 * pi * 64 */
              initial={{ strokeDashoffset: 402.12 }}
              animate={{ strokeDashoffset: 402.12 * (1 - 0.72) }} /* 72/100 */
              transition={{ duration: 2.5, delay: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="text-5xl font-black text-slate-800 tracking-tighter"
            >
              72
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"
            >
              Score
            </motion.span>
          </div>
        </div>
        
        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-center shadow-inner">
          <div className="text-xs text-accent-blue font-bold tracking-wide">AI Multi-Signal Fusion</div>
        </div>
      </motion.div>

      {/* 4 Floating Signal Cards */}
      <SignalCard icon={Activity} label="Behaviour" score="68" delay={0.2} x="0%" y="15%" bgClass="bg-blue-50" textClass="text-blue-500" />
      <SignalCard icon={MessageCircle} label="Text" score="74" delay={0.4} x="65%" y="10%" bgClass="bg-purple-50" textClass="text-purple-500" />
      <SignalCard icon={ScanFace} label="Facial" score="70" delay={0.6} x="-5%" y="65%" bgClass="bg-indigo-50" textClass="text-indigo-500" />
      <SignalCard icon={Mic} label="Voice" score="76" delay={0.8} x="60%" y="70%" bgClass="bg-cyan-50" textClass="text-cyan-500" />

    </div>
  );
}
