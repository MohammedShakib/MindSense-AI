import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import MultimodalVisual from './MultimodalVisual';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background glow elements (adjusted for light theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-accent-purple/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 mb-8">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide">Multimodal AI for Mental Wellness</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Understand Your Mind.<br/>
            <span className="text-gradient">One Signal at a Time.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            MindSense AI brings together behavioural patterns, conversations, facial expressions, and voice signals to provide a more complete view of your mental wellness.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 group" to="/assessment">
              Start Your Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" to="#how-it-works">
              See How It Works
            </Button>
          </motion.div>

          {/* Trust Line */}
          <motion.div variants={itemVariants} className="mt-10 flex items-center gap-3 text-sm text-slate-500 font-medium bg-slate-100/50 py-2 px-4 rounded-lg border border-slate-200/60">
            <span>Private</span>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <span>AI-powered</span>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <span>Built for wellness awareness</span>
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <div className="relative h-full w-full flex justify-center items-center">
          <MultimodalVisual />
        </div>

      </div>
    </section>
  );
}
