import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-900">
      
      {/* Background glowing effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#0B1021]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-purple/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      {/* Abstract wave lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 400">
        <path 
          d="M0,100 C240,200 480,0 720,100 C960,200 1200,0 1440,100 L1440,400 L0,400 Z" 
          fill="url(#waveGrad)"
        ></path>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0B1021" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Your Wellness Story Has <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan">More Than One Signal.</span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Bring those signals together with MindSense AI and gain a clearer, more complete perspective on your mental wellness.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[240px] text-lg group shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]" to="/assessment">
              Start Your Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px] text-lg bg-white/5 border-white/10 text-white hover:bg-white/10" to="#about">
              Explore MindSense AI
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
