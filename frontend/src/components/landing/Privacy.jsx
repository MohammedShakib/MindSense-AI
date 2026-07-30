import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, VideoOff, Database } from 'lucide-react';

export default function Privacy() {
  const points = [
    {
      icon: EyeOff,
      title: "Explicit Permissions",
      desc: "We require explicit consent before accessing your camera or microphone for facial and voice analysis."
    },
    {
      icon: VideoOff,
      title: "No Raw Media Storage",
      desc: "Raw video and audio files are processed in real-time and are never permanently stored unless explicitly requested."
    },
    {
      icon: Lock,
      title: "Encrypted Communication",
      desc: "All signals and chat data sent to our AI engines are encrypted end-to-end to ensure your privacy."
    },
    {
      icon: Database,
      title: "User-Controlled Data",
      desc: "Your wellness history is yours. You can view, export, or permanently delete your records at any time."
    }
  ];

  return (
    <section id="privacy" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white border-4 border-slate-50 p-12 rounded-full shadow-2xl shadow-emerald-500/10">
                <Shield className="w-32 h-32 text-emerald-500" strokeWidth={1.5} />
                <motion.div 
                  initial={{ rotate: -90, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, type: "spring" }}
                  className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg border border-slate-100"
                >
                  <Lock className="w-6 h-6 text-slate-700" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Your Wellness Data <br/>
              <span className="text-emerald-600">Deserves Privacy.</span>
            </motion.h2>
            <p className="text-lg text-slate-700 mb-10 leading-relaxed max-w-lg">
              Designed with privacy in mind. We collect only what is necessary to generate your wellness insights and protect your sensitive data through modern security architecture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {points.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <point.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-slate-900">{point.title}</h4>
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed pl-11">
                    {point.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
