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
    <section className="relative overflow-hidden bg-[#f8fbff] flex items-center pt-24 pb-14 sm:pt-28 lg:min-h-screen lg:pt-32 lg:pb-8">
      {/* Hero background matched to the assessment visual */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.13),transparent_34%),radial-gradient(circle_at_72%_48%,rgba(219,234,254,0.58),transparent_42%),radial-gradient(circle_at_86%_54%,rgba(226,232,240,0.72),transparent_38%),radial-gradient(circle_at_78%_76%,rgba(139,92,246,0.16),transparent_36%),radial-gradient(circle_at_88%_66%,rgba(6,182,212,0.10),transparent_30%),linear-gradient(90deg,rgba(219,234,254,0.48)_0%,rgba(248,251,255,0.96)_40%,rgba(242,247,255,0.92)_61%,rgba(236,242,252,0.88)_78%,rgba(237,233,254,0.64)_100%)]"></div>
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-white/55 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr] gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-xs font-semibold text-slate-700 tracking-wide leading-snug">Multimodal AI for Mental Wellness</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08] mb-5 sm:mb-6">
            Understand Your Mind.<br/>
            <span className="text-gradient">One Signal at a Time.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-xl leading-relaxed">
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
          <motion.div variants={itemVariants} className="mt-8 sm:mt-10 flex max-w-full flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-medium bg-slate-100/50 py-2 px-3 sm:px-4 rounded-lg border border-slate-200/60">
            <span>Private</span>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <span>AI-powered</span>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <span>Built for wellness awareness</span>
          </motion.div>
        </motion.div>

        {/* Right Column */}
        <div className="relative h-full w-full flex justify-center items-center overflow-visible">
          <MultimodalVisual />
        </div>

      </div>
    </section>
  );
}
