import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import AIAssessment from '../components/landing/AIAssessment';
import PersonalDashboard from '../components/landing/PersonalDashboard';
import AIWellnessSupport from '../components/landing/AIWellnessSupport';
import ReportsTracking from '../components/landing/ReportsTracking';
import Privacy from '../components/landing/Privacy';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

function HashScroller() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [hash]);

  return null;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent-blue/20 selection:text-accent-blue">
      <HashScroller />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AIAssessment />
        <PersonalDashboard />
        <AIWellnessSupport />
        <ReportsTracking />
        <Privacy />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
