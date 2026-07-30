import React from 'react';
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent-blue/20 selection:text-accent-blue">
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
