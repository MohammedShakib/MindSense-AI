import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import BrandIcon from '../../components/BrandIcon';
import GoogleLoadingOverlay from '../../components/auth/GoogleLoadingOverlay';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { registerUser } from '../../lib/api';
import { saveUserProfile } from '../../lib/userProfile';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const {
    buttonRef: googleButtonRef,
    error: googleError,
    loading: googleLoading,
    isConfigured: isGoogleConfigured,
  } = useGoogleSignIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSignupError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');

    try {
      const user = await registerUser(formData);
      saveUserProfile({
        name: user.name,
        email: user.email,
        picture: user.profile_picture,
      });
      navigate('/dashboard');
    } catch (err) {
      setSignupError(err.message || 'Registration failed');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative px-4 py-8 sm:p-6">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-cyan/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none"></div>

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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-center">Create an account</h1>
          <p className="text-slate-500 mt-2 text-center">Join MindSense AI today</p>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-purple/30 focus:border-accent-purple/50 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
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

            <div className="flex items-start gap-3 mt-4">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 w-4 h-4 rounded border-slate-300 text-accent-purple focus:ring-accent-purple/50"
                required
              />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">Terms of Service</a> and{' '}
                <a href="#" className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">Privacy Policy</a>.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" size="lg" disabled={signupLoading}>
              {signupLoading ? 'Creating...' : 'Create Account'}
            </Button>

            {signupError && (
              <p className="text-sm font-medium text-red-600">{signupError}</p>
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
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent-blue hover:text-accent-purple transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
