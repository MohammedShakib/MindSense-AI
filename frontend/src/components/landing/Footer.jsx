import React from 'react';
import { Link } from 'react-router-dom';
import BrandIcon from '../BrandIcon';

export default function Footer() {
  return (
    <footer className="bg-[#080B14] border-t border-white/5 pt-20 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <BrandIcon className="h-full w-full rounded-lg" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">MindSense <span className="text-gradient">AI</span></span>
            </Link>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              Multimodal AI-powered wellness insights for better self-awareness.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/assessment" className="hover:text-accent-blue transition-colors">Assessment</Link></li>
              <li><Link to="#ai-chat" className="hover:text-accent-blue transition-colors">AI Chat</Link></li>
              <li><Link to="#how-it-works" className="hover:text-accent-blue transition-colors">How It Works</Link></li>
              <li><Link to="#features" className="hover:text-accent-blue transition-colors">Features</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="#about" className="hover:text-accent-blue transition-colors">About</Link></li>
              <li><Link to="#privacy" className="hover:text-accent-blue transition-colors">Privacy</Link></li>
              <li><Link to="#safety" className="hover:text-accent-blue transition-colors">Safety</Link></li>
              <li><Link to="#help" className="hover:text-accent-blue transition-colors">Help</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-6">
            <span>© 2026 MindSense AI. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-400 bg-white/5 py-4 px-6 rounded-lg border border-white/10 leading-relaxed">
          MindSense AI is designed for wellness awareness, self-reflection, and supportive guidance. It does not provide medical or psychiatric diagnoses and is not a replacement for professional mental-health care.
        </div>
      </div>
    </footer>
  );
}
