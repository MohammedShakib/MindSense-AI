import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageCircle, ScanFace, Mic } from 'lucide-react';

const cards = [
  {
    title: "Behavioural Insights",
    description: "Answer simple questions about sleep, mood, stress, energy, focus, and everyday habits.",
    icon: Activity,
    color: "text-accent-blue",
    bg: "bg-blue-50",
    border: "group-hover:border-blue-200 group-hover:shadow-blue-500/10"
  },
  {
    title: "Text & Conversation Analysis",
    description: "AI analyzes conversational patterns, sentiment, and emotional signals while providing supportive guidance.",
    icon: MessageCircle,
    color: "text-accent-purple",
    bg: "bg-purple-50",
    border: "group-hover:border-purple-200 group-hover:shadow-purple-500/10"
  },
  {
    title: "Facial Emotion Analysis",
    description: "With your permission, AI analyzes facial-expression patterns through your camera.",
    icon: ScanFace,
    color: "text-accent-indigo",
    bg: "bg-indigo-50",
    border: "group-hover:border-indigo-200 group-hover:shadow-indigo-500/10"
  },
  {
    title: "Voice Emotion Analysis",
    description: "Voice characteristics and emotional patterns are analyzed from a short voice sample.",
    icon: Mic,
    color: "text-accent-cyan",
    bg: "bg-cyan-50",
    border: "group-hover:border-cyan-200 group-hover:shadow-cyan-500/10"
  }
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section id="how-it-works" className="py-24 relative bg-white border-t border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Four Signals.<br/>
            <span className="text-slate-500">One Intelligent Assessment.</span>
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 ${card.border}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${card.bg}`}>
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{card.title}</h3>
              <p className="text-slate-700 leading-relaxed text-lg">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
