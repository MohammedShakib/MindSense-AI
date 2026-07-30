import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function AIAssessment() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <section id="analysis" className="py-16 sm:py-20 lg:py-24 bg-slate-50 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-purple/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex-1 w-full"
          >
            <div className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple font-semibold text-sm mb-5 sm:mb-6">
              <BrainCircuit className="w-4 h-4" />
              <span className="leading-snug">Powered by Multimodal AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 sm:mb-6 tracking-tight leading-tight">
              One Unified <br/>
              <span className="text-gradient">Wellness Assessment.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 mb-7 sm:mb-8 leading-relaxed max-w-lg">
              MindSense AI analyzes your 4 independent signals through our Multimodal Fusion Engine to generate a single, comprehensive Wellness Concern Score and Concern Level.
            </p>
            
            <ul className="space-y-4">
              {[
                "0-100 Standardized Concern Score",
                "Dynamic Concern Level Indicators",
                "Overall Assessment Confidence Metric",
                "Handles missing modalities seamlessly"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 font-medium leading-relaxed">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex shrink-0 items-center justify-center mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-blue" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full max-w-md relative pb-0 sm:pb-10"
          >
            {/* Main Score Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-100 relative z-20 mb-5 sm:mb-6">
              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Wellness Concern Score</div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-6xl sm:text-7xl font-black text-slate-900 leading-none">72</span>
                <span className="text-lg font-bold text-slate-400 mb-2">/ 100</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent-blue to-orange-400 rounded-full"
                ></motion.div>
              </div>
              <div className="flex justify-between gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 mb-6 uppercase">
                <span>Lower Concern</span>
                <span>Moderate</span>
                <span className="text-right">Higher Concern</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex shrink-0 items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-orange-800 uppercase tracking-wide">Concern Level</div>
                    <div className="text-sm font-bold text-orange-900">High Concern</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Confidence Card */}
            <motion.div variants={itemVariants} className="relative z-30 flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:absolute sm:-bottom-8 sm:-right-4 sm:w-64 sm:p-5 lg:-right-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Info className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">AI Confidence</div>
                <div className="text-lg font-black text-slate-900">92% High</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
