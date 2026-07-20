"use client";

import Hero from "@/components/landing/Hero";
import SensitiveData from "@/components/landing/SensitiveData";
import Pipeline from "@/components/landing/Pipeline";
import PrivacyCore from "@/components/landing/PrivacyCore";
import DashboardPreview from "@/components/landing/DashboardPreview";
import Policies from "@/components/landing/Policies";
import Onboarding from "@/components/landing/Onboarding";
import Trust from "@/components/landing/Trust";
import FinalCTA from "@/components/landing/FinalCTA";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation />
      <Hero />
      <SensitiveData />
      <PrivacyCore />
      <DashboardPreview />
      <Policies />
      <Onboarding />
      <Trust />
      <FinalCTA />
      <Footer/>
    </div>
  );
}
