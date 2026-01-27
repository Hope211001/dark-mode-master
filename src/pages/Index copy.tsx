import React from 'react';
import { ArrowRight, MapPin, TrendingUp, Mail, Shield, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import Benefits from '@/components/home/benefits';
import CTA from '@/components/home/cta';
import HeaderHome  from '@/components/partials/header/header.home';
import FooterHome from '@/components/partials/footer/footer.home';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Fixed */}
      <HeaderHome></HeaderHome>

      {/* Hero Section */}
      <Hero></Hero>

      {/* Features Section */}
      <Features></Features>

      {/* Benefits Section */}
      <Benefits></Benefits>

      {/* CTA Section */}
      <CTA></CTA>

      {/* Footer */}
      <FooterHome></FooterHome>
    </div>
  );
};

export default LandingPage;