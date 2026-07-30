import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import BrandIcon from '../../components/BrandIcon';

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt', formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative p-6">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <BrandIcon className="h-full w-full" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-center">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-center">Sign in to your MindSense AI account</p>
        </div>

        <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple/50 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-accent-blue hover:text-accent-purple transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple/50 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <button className="w-full mt-6 flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-semibold shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.61V20.34H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.26 20.34L15.69 17.61C14.7 18.27 13.46 18.67 12 18.67C9.18 18.67 6.78 16.76 5.89 14.19H2.22V17.03C4.02 20.61 7.71 23 12 23Z" fill="#34A853"/>
              <path d="M5.89 14.19C5.66 13.51 5.53 12.77 5.53 12C5.53 11.23 5.66 10.49 5.89 9.81V6.97H2.22C1.48 8.44 1.05 10.15 1.05 12C1.05 13.85 1.48 15.56 2.22 17.03L5.89 14.19Z" fill="#FBBC05"/>
              <path d="M12 5.33C13.62 5.33 15.06 5.89 16.2 6.98L19.34 3.84C17.46 2.09 14.97 1 12 1C7.71 1 4.02 3.39 2.22 6.97L5.89 9.81C6.78 7.24 9.18 5.33 12 5.33Z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
