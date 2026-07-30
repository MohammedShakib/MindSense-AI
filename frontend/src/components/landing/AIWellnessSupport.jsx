import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react';

export default function AIWellnessSupport() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Insights That Turn Into Action.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">AI Wellness Support.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Chatbot Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[500px]"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">MindSense Companion</h3>
                <p className="text-xs text-slate-500">Supportive AI Chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="flex flex-col gap-1 items-end">
                <div className="bg-accent-blue text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                  I've been feeling overwhelmed lately and it's becoming harder to focus.
                </div>
              </div>
              
              <div className="flex flex-col gap-2 items-start">
                <div className="bg-white border border-slate-200 text-slate-700 px-5 py-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm leading-relaxed">
                  It sounds like you've been carrying a lot recently. We can explore what may be contributing to that feeling and look at some simple wellness steps together.
                </div>
                
                {/* AI Analysis Indicators */}
                <div className="flex gap-2 mt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="text-[10px] font-bold text-orange-800 uppercase">Tone: Stressed</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-800 uppercase">Support Mode</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 relative">
              <div className="w-full bg-white border border-slate-200 rounded-full h-12 px-5 flex items-center text-slate-400 text-sm">
                Type your message here...
              </div>
              <div className="absolute right-2 top-6 w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Actionable Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Daily Wellness Tasks</h3>
              </div>
              <p className="text-slate-700 pl-16">Personalized actionable steps based on your current signals. Example: <em>Take a 10-minute outdoor walk to reset focus.</em></p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <PlayCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Guided Mindfulness</h3>
              </div>
              <p className="text-slate-700 pl-16">Quick audio and breathing exercises. Example: <em>2-minute guided breathing session for stress relief.</em></p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Recommendations</h3>
              </div>
              <p className="text-slate-700 pl-16">Curated wellness resources, articles, and videos tailored specifically to your recent assessment results.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
