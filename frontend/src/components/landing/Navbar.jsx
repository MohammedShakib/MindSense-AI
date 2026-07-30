import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BrainCircuit } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "glass-nav py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center border border-accent-purple/20 group-hover:border-accent-purple/40 shadow-sm transition-colors"
          >
            <BrainCircuit className="w-6 h-6 text-accent-blue" />
          </motion.div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">MindSense <span className="text-gradient">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</Link>
          <Link to="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
          <Link to="#analysis" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">AI Analysis</Link>
          <Link to="#privacy" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Privacy</Link>
          <Link to="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" to="/login">Sign In</Button>
          <Button variant="primary" to="/register">Get Started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600 hover:text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden glass-nav absolute top-full left-0 right-0 border-t border-slate-200/50 py-4 px-6 flex flex-col gap-4 shadow-xl"
          >
            <Link to="#how-it-works" className="text-slate-700 font-medium py-2 hover:text-accent-blue" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link to="#features" className="text-slate-700 font-medium py-2 hover:text-accent-blue" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link to="#privacy" className="text-slate-700 font-medium py-2 hover:text-accent-blue" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
            <hr className="border-slate-200" />
            <Button variant="ghost" className="justify-start px-0" to="/login">Sign In</Button>
            <Button variant="primary" className="w-full" to="/register">Get Started</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
