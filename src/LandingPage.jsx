import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, BarChart3, Shield, Activity, Target, FileText } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3
      }
    }
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            MERCADO
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            Corporate Intelligence Redefined.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/product'}
            >
              Research a Product
              <ArrowRight size={20} />
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/research'}
            >
              Research a Market
              <ArrowRight size={20} />
            </button>
            
            <button 
              className="btn btn-ghost"
              onClick={scrollToAbout}
            >
              About System
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-content">
          <h2 className="about-title">Capabilities</h2>
          <div className="capabilities-grid">
            <div className="capability-card">
            <TrendingUp size={32} className="capability-icon" />
            <h3>Sentiment Analysis</h3>
            <p>Real-time market sentiment tracking across digital channels</p>
          </div>
          
          <div className="capability-card">
            <BarChart3 size={32} className="capability-icon" />
            <h3>Competitor Benchmarking</h3>
            <p>Comprehensive competitive intelligence and positioning analysis</p>
          </div>
          
          <div className="capability-card">
            <Shield size={32} className="capability-icon" />
            <h3>Financial Risk Modeling</h3>
            <p>Advanced risk assessment and financial impact projections</p>
          </div>

          {/* NEW CAPABILITIES */}
          
          <div className="capability-card">
            <Activity size={32} className="capability-icon" />
            <h3>Predictive Churn Analytics</h3>
            <p>Forecast customer attrition risks using historical sentiment velocity</p>
          </div>

          <div className="capability-card">
            <Target size={32} className="capability-icon" />
            <h3>Strategic Prioritization</h3>
            <p>Automated "Pain-to-Priority" matrices for immediate engineering action</p>
          </div>

          <div className="capability-card">
            <FileText size={32} className="capability-icon" />
            <h3>Audit-Grade Traceability</h3>
            <p>Full data lineage with verifiable references to raw user evidence</p>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
