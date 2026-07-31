import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import BrandIcon from '../../components/BrandIcon';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import GoogleLoadingOverlay from '../../components/auth/GoogleLoadingOverlay';

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const {
    buttonRef: googleButtonRef,
    error: googleError,
    loading: googleLoading,
    isConfigured: isGoogleConfigured,
  } = useGoogleSignIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email.trim() === 'admin' && formData.password === 'admin') {
      navigate('/admin');
      return;
    }

    setLoginError('Use admin/admin to open the admin panel.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative px-4 py-8 sm:p-6">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <BrandIcon className="h-full w-full" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-center">Sign in to your MindSense AI account</p>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple/50 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap justify-between gap-2 items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-accent-blue hover:text-accent-purple transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="password"
                  autoComplete="current-password"
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

            {loginError && (
              <p className="text-sm font-medium text-red-600">{loginError}</p>
            )}
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 sm:gap-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">or continue with</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <div className="relative mt-6">
            {isGoogleConfigured ? (
              <div className={googleLoading ? 'pointer-events-none opacity-40' : ''} ref={googleButtonRef} />
            ) : (
              <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                Google sign-in needs VITE_GOOGLE_CLIENT_ID.
              </div>
            )}
            <GoogleLoadingOverlay loading={googleLoading} />
            {googleError && (
              <p className="mt-3 text-sm font-medium text-red-600">{googleError}</p>
            )}
          </div>
        </div>

        <p className="text-center mt-6 sm:mt-8 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
