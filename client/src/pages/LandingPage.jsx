import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import LiveActivityWidget from '../components/LiveActivityWidget';
import {
  FiCheckCircle, FiUpload, FiStar, FiShield, FiClock,
  FiChevronDown, FiArrowRight, FiDollarSign, FiFileText,
  FiUsers, FiAward, FiZap, FiLock, FiChevronRight, FiSearch
} from 'react-icons/fi';


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
};

// --- Hero Section --------------------------------------------------------------
const Hero = () => {
  const [saleStatus, setSaleStatus] = useState('ENDED');

  useEffect(() => {
    const flashSaleStart = new Date('2026-06-01T04:30:00Z');
    const flashSaleEnd = new Date('2026-06-01T16:30:00Z');
    
    const checkSale = () => {
      const now = new Date();
      if (now < flashSaleStart) setSaleStatus('UPCOMING');
      else if (now >= flashSaleStart && now < flashSaleEnd) setSaleStatus('ACTIVE');
      else setSaleStatus('ENDED');
    };
    checkSale();
    const interval = setInterval(checkSale, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
  <section className="min-h-screen relative overflow-hidden pt-32 pb-20 flex items-center bg-[#F5F5F5]">
    <div className="container-max w-full">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Left Content */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left z-10">
          
          {/* Top Educator & Genuine Review trust banner */}
          <motion.div variants={fadeUp} className="mb-8 flex justify-center lg:justify-start">
            <div className="relative inline-block px-6 py-3.5 bg-white/80 backdrop-blur-md rounded-[20px] border border-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer">
              
              {/* Hand-drawn little paper clip vector on top left in matching black */}
              <div className="absolute -top-3.5 -left-1 transform -rotate-12 text-black/80">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>

              {/* Hand-drawn golden star badge icon */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 text-yellow-500 animate-pulse">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                
                <div className="text-left font-inter font-bold text-gray-800 text-[13.5px] tracking-wide leading-none flex flex-wrap items-center">
                  <span className="relative inline-block text-gray-900 mr-1 pb-1">
                    Get checked by
                  </span>
                  
                  {/* Sketched yellow marker stroke behind "top educator" */}
                  <span className="relative z-10 mx-1 px-1 font-extrabold text-amber-950 font-caveat text-xl pb-1 leading-none">
                    top educator
                    <svg className="absolute left-0 bottom-0 w-full h-[7px] text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9C30 9 70 3 99 7C70 8 30 7 2 5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>
                  
                  <span className="text-yellow-500/50 mx-2 pb-1">•</span>
                  
                  {/* Sketched yellow marker stroke behind "100% genuine review" */}
                  <span className="relative z-10 mx-1 px-1 font-extrabold text-amber-950 font-caveat text-xl pb-1 leading-none">
                    100% genuine review
                    <svg className="absolute left-0 bottom-0 w-full h-[7px] text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9C30 9 70 3 99 7C70 8 30 7 2 5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>

                  <span className="text-red-500/50 mx-2 pb-1 hidden sm:inline-block">•</span>
                  
                  {/* Sketched red marker stroke behind "price drop" */}
                  {saleStatus !== 'ENDED' && (
                    <span className="relative z-10 mx-1 mt-1 sm:mt-0 px-2 py-0.5 font-extrabold text-white bg-red-600 rounded-md font-sans text-[12px] uppercase tracking-wider leading-none flex items-center gap-1 shadow-sm animate-pulse">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      {saleStatus === 'ACTIVE' ? 'Price Drop LIVE! Ends 10 PM' : 'Price drop tomorrow (1 June) 10 AM - 10 PM'}
                    </span>
                  )}
                </div>
              </div>
              
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeUp} 
            className="mb-8 text-gray-900 relative pb-6" 
            style={{ fontFamily: 'Caveat', fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)', lineHeight: 1.15, fontWeight: 700 }}
          >
            {"Don't Apply For CBSE Recheck Blindly".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2 + index * 0.04,
                  duration: 0.15,
                  ease: "easeOut"
                }}
                className="inline-block"
                style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
              >
                {char}
              </motion.span>
            ))}
            
            {/* Elegant Pencil-drawn Double Underline SVG */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 bottom-0 w-[80%] sm:w-[60%] lg:w-[75%] h-[12px] text-yellow-500"
              viewBox="0 0 350 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M5 9C50 6 150 3 340 7C290 8 100 8.5 15 10C70 9.5 210 9 320 8.5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: 0.2 + 37 * 0.04 + 0.2, // 37 characters total
                  duration: 1.1,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg lg:text-xl mb-10 text-gray-500 font-light" style={{ lineHeight: 1.7 }}>
            Get expert subject-wise analysis before spending money on re-evaluation or verification.
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
            <Link to="/auth" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black text-white font-medium text-[15px] hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline gap-2">
              Check My Chances <FiArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-sm font-medium text-gray-500">

            {/* Secure Uploads */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure Uploads
            </div>

            {/* Top Educators */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/>
              </svg>
              Checked by Top Educators
            </div>

            {/* Genuine Review */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              100% Genuine Review
            </div>

            {/* Razorpay Protected */}
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Razorpay Protected
            </div>


          </motion.div>
        </motion.div>

        {/* Right Content - Mockups */}
        <div className="relative h-[550px] sm:h-[600px] lg:h-[650px] w-full flex items-center justify-center mt-12 lg:mt-0 z-10">
          
          {/* Glowing decorative blobs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-1/4 right-[10%] w-[250px] h-[250px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none -z-10"></div>
          
          {/* Floating Card (Center-ish) */}
          <motion.div 
            initial={{ opacity: 0, y: 40, x: -50 }} 
            animate={{ opacity: 1, y: 0, x: -10 }} 
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="absolute top-[40%] left-[2%] lg:left-0 -translate-y-1/2 z-20 w-[290px] lg:w-[310px] hidden md:block"
          >
            <div className="bg-white/85 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.09)] border border-white/60">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-yellow-100/50">
                  <FiFileText size={22} className="text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">Physics -- Class 12</div>
                  <div className="text-[13px] text-gray-500 font-medium">CBSE 2027</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-5">
                <div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">Current Marks</div>
                  <div className="font-semibold text-gray-900 text-lg">67/100</div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">Expected After Recheck</div>
                  <div className="font-semibold text-green-600 text-lg">72–75/100</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiCheckCircle className="text-green-500" size={16} />
                  <span className="text-[13px] font-semibold text-gray-900">Apply for Re-evaluation</span>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                  "Step marking appears missing. Likely +5 marks increase."
                </p>
              </div>
            </div>
          </motion.div>

          {/* iPhone Mockup (Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-5 md:left-auto md:right-[2%] lg:right-0 w-[260px] sm:w-[280px] lg:w-[310px] h-[480px] sm:h-[530px] lg:h-[580px] bg-white rounded-[40px] lg:rounded-[45px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border-[6px] lg:border-[8px] border-[#111827] overflow-hidden flex flex-col z-10"
          >
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] lg:w-[100px] h-[22px] lg:h-[25px] bg-[#111827] rounded-b-[14px] lg:rounded-b-[16px] z-30"></div>
            
            {/* Phone Header */}
            <div className="px-5 lg:px-6 pt-10 lg:pt-12 pb-2 lg:pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-2.5">CR</div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">Expert<br/>Recommendation</h3>
              <p className="text-[10px] lg:text-[11px] text-gray-400 mt-1 font-semibold leading-normal">Select the most suitable option based on your answer sheet analysis.</p>
            </div>

            {/* Orange Highlight Card (Expert Analysis) */}
            <div className="mx-4 lg:mx-5 mb-2.5 p-3 rounded-[16px] bg-gradient-to-br from-orange-50 to-amber-50/60 border border-orange-200 flex flex-col gap-1 shadow-sm shadow-orange-500/5">
              <div className="flex items-center gap-1.5">
                <FiSearch size={13} className="text-orange-600 shrink-0" />
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-orange-800">Expert Analysis</span>
              </div>
              <p className="text-[10.5px] font-semibold text-gray-600 leading-snug">
                Our review team checks for possible step-marking issues, unchecked sections, and evaluation inconsistencies.
              </p>
              <p className="text-[8.5px] font-medium text-gray-400 leading-tight border-t border-orange-100/50 pt-1.5 mt-0.5">
                Recommendations are based on expert analysis and do not guarantee final CBSE outcomes.
              </p>
            </div>

            {/* Phone Body */}
            <div className="flex-1 px-4 lg:px-5 space-y-2 lg:space-y-2.5 mt-1">
              
              {/* Option 1: Re-evaluation */}
              <div className="p-2.5 lg:p-3 rounded-[14px] lg:rounded-[16px] border-[1.5px] border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50/30 flex items-center justify-between gap-2 shadow-sm shadow-blue-500/5 cursor-pointer hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span className="text-[11px] lg:text-[12.5px] font-bold text-blue-900 leading-tight">Apply for Re-evaluation</span>
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">High Potential</span>
              </div>

              {/* Option 2: Verification Only */}
              <div className="p-2.5 lg:p-3 rounded-[14px] lg:rounded-[16px] border border-gray-200 bg-white flex items-center justify-between gap-2 cursor-pointer hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white shrink-0"></div>
                  <span className="text-[11px] lg:text-[12.5px] font-semibold text-gray-700 leading-tight">Verification Only</span>
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0">Moderate Potential</span>
              </div>

              {/* Option 3: Not Recommended */}
              <div className="p-2.5 lg:p-3 rounded-[14px] lg:rounded-[16px] border border-gray-100 bg-gray-50/50 opacity-60 flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-200 bg-white shrink-0"></div>
                  <span className="text-[11px] lg:text-[12.5px] font-medium text-gray-400 leading-tight">Not Recommended</span>
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-gray-400 text-white shrink-0">Low Potential</span>
              </div>
            </div>

            {/* Phone Footer */}
            <div className="p-5 lg:p-6 bg-gradient-to-t from-white via-white to-transparent">
              <div className="w-full py-3 bg-yellow-400 rounded-full flex items-center justify-center text-[13px] lg:text-[14px] font-bold text-gray-900 mb-3 gap-1.5 cursor-pointer shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all">
                View Detailed Analysis <FiArrowRight size={15} />
              </div>
              <div className="flex items-center justify-center gap-4 text-[9px] lg:text-[10px] text-gray-400 font-semibold">
                <span className="flex items-center gap-1"><FiLock size={9} /> Secure</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FiShield size={9} /> Private</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  </section>
  );
};

// --- How It Works --------------------------------------------------------------
const steps = [
  { step: '01', title: 'Submit Details', desc: 'Enter your marks and upload answer sheets securely.' },
  { step: '02', title: 'Expert Analysis', desc: 'Our experienced CBSE evaluators review your paper.' },
  { step: '03', title: 'Get Report', desc: 'Receive a detailed recommendation within 12 hours.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-white">
    <div className="container-max">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16 md:mb-20">
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">How It Works</motion.h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-16 md:gap-12 relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-12 left-20 right-20 h-[1px] bg-gray-100 border-dashed border-t" />
        
        {steps.map((s, i) => (
          <div key={s.step} className="relative text-center group flex flex-col items-center">
            {/* Hand-drawn Circular Step Indicator */}
            <div className="w-24 h-24 relative flex items-center justify-center mb-6">
              
              {/* Double-stroke Sketched Pencil Loop */}
              <svg className="absolute inset-0 w-full h-full text-blue-500 pointer-events-none" viewBox="0 0 100 100" fill="none">
                <motion.path
                  d="M50,8 C75,6 93,24 92,50 C91,76 73,92 48,91 C23,90 8,72 9,47 C10,22 28,7 52,9 C72,11 88,27 88,48 C88,62 78,74 65,77"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, rotate: -15 }}
                  whileInView={{ pathLength: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: i * 0.18 }}
                />
              </svg>

              {/* Handwritten Step Number */}
              <motion.span
                initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.18 + 0.4 }}
                style={{ fontFamily: 'Caveat' }}
                className="text-4xl font-extrabold text-blue-600 select-none"
              >
                {s.step}
              </motion.span>
            </div>

            {/* Step Title */}
            <motion.h3 
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.18 + 0.6 }}
              className="text-xl font-bold text-gray-900 mb-3"
            >
              {s.title}
            </motion.h3>

            {/* Step Description */}
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.18 + 0.75 }}
              className="text-[14px] md:text-[15px] text-gray-500 leading-relaxed max-w-[250px] mx-auto font-medium"
            >
              {s.desc}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Mid Statement Divider ---------------------------------------------------
const MidStatement = ({ text, accent, stats }) => (
  <div className="relative overflow-hidden bg-[#F5F5F5] py-16 md:py-20">
    {/* Subtle dot-grid background */}
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      opacity: 0.45,
    }} />
    {/* Gradient fade edges */}
    <div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10" />
    <div aria-hidden="true" className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10" />

    <div className="container-max relative z-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
      {/* Large statement */}
      <motion.p
        initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        style={{ fontFamily: 'Caveat, cursive', fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 700, lineHeight: 1.2, color: '#111827', maxWidth: '560px' }}
      >
        {text}{' '}
        <span style={{ color: '#2563eb' }}>{accent}</span>
      </motion.p>

      {/* Inline stat pills */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-4 md:flex-col md:items-end shrink-0"
        >
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center md:items-end">
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#111827', lineHeight: 1 }}>{s.value}</span>
              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  </div>
);

// --- Features -----------------------------------------------------------------
const features = [
  { icon: FiCheckCircle, title: 'Accurate Analysis', desc: 'Subject-wise mark analysis with step-by-step reasoning.' },
  { icon: FiShield, title: 'Honest Recommendations', desc: 'We tell you the truth, even if it means not applying.' },
  { icon: FiFileText, title: 'Detailed PDF Reports', desc: 'Downloadable reports explaining the evaluation.' },
  { icon: FiZap, title: 'Fast Response', desc: 'Expert recommendations within 12 hours guaranteed.' },
  { icon: FiLock, title: 'Secure Storage', desc: 'Encrypted storage for your sensitive documents.' },
  { icon: FiUsers, title: 'Subject-wise Guidance', desc: 'Reviewed strictly by subject matter experts.' },
];

const Features = () => (
  <section id="features" className="py-32 bg-[#F5F5F5]">
    <div className="container-max max-w-6xl">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Why Choose Us</h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[24px] p-8 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-6 text-gray-600">
              <f.icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Pricing ------------------------------------------------------------------


const plans = [
  { subjects: 1, price: 59, originalPrice: 59, label: '1 Subject' },
  { subjects: 2, price: 99, originalPrice: 99, label: '2 Subjects', popular: true },
  { subjects: '3+', price: 149, originalPrice: 149, label: '3+ Subjects' },
];

const Pricing = () => {
  const [saleStatus, setSaleStatus] = useState('ENDED');
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [flashTimeLeft, setFlashTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [flashSaleText, setFlashSaleText] = useState("");
  const [flashSaleSubText, setFlashSaleSubText] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const flashSaleStart = new Date('2026-06-01T04:30:00Z'); // 10:00 AM IST
      const flashSaleEnd = new Date('2026-06-01T16:30:00Z'); // 10:00 PM IST
      
      let status = 'ENDED';
      let targetTime = null;
      let text = "";
      let subText = "";

      if (now < flashSaleStart) {
        status = 'UPCOMING';
        text = "Price drop tomorrow (1 June) 10 AM - 10 PM";
        subText = "Sale begins in";
        targetTime = flashSaleStart;
      } else if (now >= flashSaleStart && now < flashSaleEnd) {
        status = 'ACTIVE';
        text = "SALE IS LIVE! Ends at 10 PM";
        subText = "Sale ends in";
        targetTime = flashSaleEnd;
      } else {
        status = 'ENDED';
      }

      setSaleStatus(status);
      setFlashSaleText(text);
      setFlashSaleSubText(subText);
      
      if (targetTime) {
        let flashDiff = targetTime - now;
        if (flashDiff < 0) flashDiff = 0;
        
        const fh = Math.floor((flashDiff / (1000 * 60 * 60))).toString().padStart(2, '0');
        const fm = Math.floor((flashDiff / 1000 / 60) % 60).toString().padStart(2, '0');
        const fs = Math.floor((flashDiff / 1000) % 60).toString().padStart(2, '0');
        setFlashTimeLeft({ h: fh, m: fm, s: fs });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (saleStatus === 'ENDED') {
    return (
      <section id="pricing" className="py-32 bg-[#F5F5F5] relative">
        <div className="container-max max-w-5xl px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-[15px]">Choose the number of subjects you want our experts to evaluate.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((p) => (
              <div key={p.label} className={`bg-white rounded-[24px] p-8 border ${p.popular ? 'border-blue-500 shadow-xl relative transform md:-translate-y-4' : 'border-gray-100 shadow-sm'} transition-transform hover:-translate-y-2`}>
                {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">Top Pick</div>}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.label}</h3>
                <div className="text-4xl font-black text-gray-900 mb-6 font-inter">₹{p.originalPrice}</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-medium"><FiCheckCircle className="text-green-500 shrink-0" size={18} /> Expert Evaluation</li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-medium"><FiCheckCircle className="text-green-500 shrink-0" size={18} /> Detailed PDF Report</li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 font-medium"><FiCheckCircle className="text-green-500 shrink-0" size={18} /> 12-Hour Turnaround</li>
                </ul>
                <Link to="/auth" className={`block w-full py-3.5 rounded-full text-center text-sm font-bold transition-all no-underline ${p.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const isFlashSaleActive = saleStatus === 'ACTIVE';

  return (
  <section id="pricing" className="py-32 bg-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
    <div className="container-max max-w-5xl relative z-10">
      {/* Cartoonish Sketched Flash Sale Announcement Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-[92%] md:max-w-5xl mx-auto mb-20 md:mb-24 relative py-8 md:py-12 px-4 md:px-12 bg-white mt-8 md:mt-12 overflow-hidden sm:overflow-visible"
        style={{ 
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
          backgroundSize: '24px 24px',
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
          border: '3px solid #1E293B',
          boxShadow: '8px 8px 0px rgba(30,41,59,0.1)'
        }}
      >
        <div className="text-center mb-10 md:mb-16 relative z-10 mt-2 md:mt-4">
          <div className={`inline-flex items-center justify-center gap-2 mb-4 md:mb-6 px-3 md:px-5 py-1.5 md:py-2 border-2 transform -rotate-2 ${isFlashSaleActive ? 'bg-red-50 border-red-600' : 'bg-blue-50 border-blue-600'}`} style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFlashSaleActive ? 'bg-red-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 ${isFlashSaleActive ? 'bg-red-600' : 'bg-blue-600'}`}></span>
            </span>
            <span className={`text-[11px] md:text-sm font-black uppercase tracking-widest font-mono ${isFlashSaleActive ? 'text-red-700' : 'text-blue-700'}`}>{flashSaleText}</span>
          </div>
          
          <h3 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-6 relative inline-block z-10 transform rotate-1" style={{ fontFamily: 'Caveat' }}>
            Massive Price Drop!
            {/* Cartoon Highlights / underlines */}
            <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-[14px] md:h-[20px] text-yellow-400 -z-10" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
              <path d="M5 15 Q 75 5, 150 15 T 290 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
              <path d="M10 18 Q 80 8, 140 18 T 280 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            </svg>
          </h3>
          
          {/* Hand-drawn Timer */}
          <div className="flex flex-col items-center justify-center gap-2 md:gap-3 mt-6 md:mt-8">
            <div className="text-base md:text-lg font-black text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'Caveat' }}>{flashSaleSubText}</div>
            <div className="flex items-center gap-2 md:gap-3 text-gray-900 font-black text-2xl md:text-3xl" style={{ fontFamily: 'Caveat' }}>
              <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-gray-900 transform -rotate-3" style={{ borderRadius: '15px 225px 15px 255px/255px 15px 225px 15px' }}><span className="leading-none text-2xl md:text-4xl">{flashTimeLeft.h}</span><span className="text-[10px] md:text-[12px] uppercase mt-0.5 md:mt-1 font-mono tracking-tight">Hrs</span></div>
              <span className="text-gray-400 -mt-2 md:-mt-4">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-gray-900 transform rotate-2" style={{ borderRadius: '225px 15px 255px 15px/15px 255px 15px 225px' }}><span className="leading-none text-2xl md:text-4xl">{flashTimeLeft.m}</span><span className="text-[10px] md:text-[12px] uppercase mt-0.5 md:mt-1 font-mono tracking-tight">Min</span></div>
              <span className="text-gray-400 -mt-2 md:-mt-4">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-gray-900 transform -rotate-1" style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}><span className="leading-none text-2xl md:text-4xl">{flashTimeLeft.s}</span><span className="text-[10px] md:text-[12px] uppercase mt-0.5 md:mt-1 font-mono tracking-tight">Sec</span></div>
            </div>
          </div>
        </div>

        {/* 3 Steps / Prices Layout */}
        <div className="relative mt-8 md:mt-12 pb-4 md:pb-8">
          {/* Messy scribbled connecting line */}
          <div className="absolute top-20 left-[10%] right-[10%] hidden md:block z-0">
            <svg className="w-full h-12 text-blue-300" preserveAspectRatio="none" viewBox="0 0 200 20" fill="none">
              <path d="M0,10 Q 20,-5 40,15 T 80,5 T 120,15 T 160,5 T 200,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M5,12 Q 25,0 45,12 T 85,8 T 125,12 T 165,8 T 195,12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10 max-w-5xl mx-auto px-1 md:px-2">
            
            {/* Price 1 */}
            <motion.div whileHover={{ y: -5, rotate: -2 }} className="flex flex-col items-center text-center bg-white p-5 md:p-8 border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative transition-all duration-300" style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>
              
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex flex-col items-center justify-center mb-4 md:mb-6">
                {/* Perfect Hand-drawn Blue Circle */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-blue-600 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M49 8 C72 8 92 25 92 49 C92 72 72 92 49 92 C25 92 8 72 8 49 C8 25 25 8 49 8" />
                  <path d="M45 14 C65 14 85 30 85 50 C85 70 65 86 45 86 C25 86 14 70 14 50" opacity="0.5" strokeWidth="2" />
                  <path d="M30 30 C50 20 80 40 70 70" opacity="0.3" strokeWidth="1" />
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-gray-500 font-black text-lg md:text-xl line-through decoration-red-500 decoration-2 md:decoration-[3px] transform -rotate-6" style={{ fontFamily: 'Caveat' }}>₹59</span>
                  <span className="font-black text-5xl md:text-6xl text-gray-900 leading-none" style={{ fontFamily: 'Caveat' }}>₹44</span>
                </div>
              </div>
              
              <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2 transform rotate-1" style={{ fontFamily: 'Caveat' }}>1 Subject</h4>
              <p className="text-gray-700 font-bold text-[13px] md:text-sm font-mono">Expert evaluation for a single subject at a discount.</p>
            </motion.div>

            {/* Price 2 - HOT */}
            <motion.div whileHover={{ y: -5, rotate: 2 }} className="flex flex-col items-center text-center bg-[#fef08a] p-6 md:p-8 border-[3px] border-blue-700 shadow-[4px_4px_0px_rgba(29,78,216,1)] md:shadow-[6px_6px_0px_rgba(29,78,216,1)] relative transition-all duration-300 md:-translate-y-6" style={{ borderRadius: '15px 255px 15px 225px/225px 15px 255px 15px' }}>
              
              <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] md:text-sm font-black uppercase px-3 py-1.5 md:px-4 md:py-2 border-[3px] border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_rgba(0,0,0,1)] transform -rotate-6 z-20 whitespace-nowrap" style={{ fontFamily: 'Caveat', letterSpacing: '2px', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}>Top Pick!</div>
              
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center mb-4 md:mb-6 mt-3 md:mt-4">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-blue-700 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M49 8 C72 8 92 25 92 49 C92 72 72 92 49 92 C25 92 8 72 8 49 C8 25 25 8 49 8" />
                  <path d="M45 14 C65 14 85 30 85 50 C85 70 65 86 45 86 C25 86 14 70 14 50" opacity="0.5" strokeWidth="2.5" />
                  <path d="M35 30 C55 20 75 40 65 65" opacity="0.3" strokeWidth="1.5" />
                  <path d="M15 50 C30 20 70 20 85 50" opacity="0.2" strokeWidth="1" />
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-gray-600 font-black text-xl md:text-2xl line-through decoration-red-600 decoration-[3px] md:decoration-[4px] transform -rotate-3" style={{ fontFamily: 'Caveat' }}>₹99</span>
                  <span className="font-black text-6xl md:text-7xl text-blue-800 leading-none transform rotate-2" style={{ fontFamily: 'Caveat' }}>₹74</span>
                </div>
              </div>
              
              <h4 className="text-2xl md:text-3xl font-black text-blue-900 mb-1 md:mb-2 transform -rotate-2" style={{ fontFamily: 'Caveat' }}>2 Subjects</h4>
              <p className="text-blue-900 font-bold text-[13px] md:text-sm font-mono leading-tight">Highly recommended. Secure better analysis.</p>
            </motion.div>

            {/* Price 3 */}
            <motion.div whileHover={{ y: -5, rotate: -2 }} className="flex flex-col items-center text-center bg-white p-5 md:p-8 border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] relative transition-all duration-300" style={{ borderRadius: '225px 15px 255px 15px/15px 255px 15px 225px' }}>
              
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex flex-col items-center justify-center mb-4 md:mb-6">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-blue-600 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M49 8 C72 8 92 25 92 49 C92 72 72 92 49 92 C25 92 8 72 8 49 C8 25 25 8 49 8" />
                  <path d="M45 14 C65 14 85 30 85 50 C85 70 65 86 45 86 C25 86 14 70 14 50" opacity="0.5" strokeWidth="2" />
                  <path d="M30 30 C50 20 80 40 70 70" opacity="0.3" strokeWidth="1" />
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-gray-500 font-black text-lg md:text-xl line-through decoration-red-500 decoration-2 md:decoration-[3px] transform rotate-3" style={{ fontFamily: 'Caveat' }}>₹149</span>
                  <span className="font-black text-5xl md:text-6xl text-gray-900 leading-none transform -rotate-1" style={{ fontFamily: 'Caveat' }}>₹114</span>
                </div>
              </div>
              
              <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2 transform rotate-2" style={{ fontFamily: 'Caveat' }}>3+ Subjects</h4>
              <p className="text-gray-700 font-bold text-[13px] md:text-sm font-mono">Best value. Maximize your chances for a flat rate.</p>
            </motion.div>
            
          </div>
        </div>
      </motion.div>

      <div className="text-center mb-16 mt-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Current Pricing</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {plans.map((plan, i) => (
          <motion.div key={plan.subjects} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`bg-[#F5F5F5] rounded-[32px] p-8 md:p-10 relative ${plan.popular ? 'bg-black text-white py-12 shadow-2xl z-10' : 'text-gray-900'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className="text-[13px] font-semibold tracking-wide uppercase mb-4 opacity-70">{plan.label}</div>
            
            <div className="flex flex-col mb-6">
              {/* Crossed-out price + compact badge row */}
              <div className="flex items-center gap-3 mb-3 mt-3">
                {/* Crossed-out original price */}
                <div className="relative inline-block">
                  <span className={`text-2xl font-bold ${plan.popular ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: 'Caveat' }}>₹{plan.originalPrice}</span>
                  <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] text-red-500" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
                    <path d="M0,60 Q50,35 100,40 M0,45 Q50,65 100,55" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>

                {/* Compact pill chip */}
                <div className="relative flex-shrink-0">
                  <div className="flex items-center gap-0 rounded-full overflow-hidden shadow-sm">
                    {/* % OFF pill-left */}
                    <div className="bg-red-500 px-2.5 py-1.5 flex items-center gap-1">
                      <span className="text-[11px] font-black text-white tracking-tight leading-none">
                        {Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    {/* Countdown pill-right */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 ${plan.popular ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      {/* Live dot */}
                      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                      </span>
                      <span className={`font-mono text-[12px] font-bold leading-none tabular-nums ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                        {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actual price */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-bold tracking-tighter">₹{plan.price}</span>
                <span className={`text-[13px] ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/ one-time</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-[14px]">
                <FiCheckCircle size={16} className={plan.popular ? "text-green-400" : "text-gray-400"} /> Subject analysis
              </li>
              <li className="flex items-center gap-3 text-[14px]">
                <FiCheckCircle size={16} className={plan.popular ? "text-green-400" : "text-gray-400"} /> PDF Recommendation
              </li>
              <li className="flex items-center gap-3 text-[14px]">
                <FiCheckCircle size={16} className={plan.popular ? "text-green-400" : "text-gray-400"} /> Expert Review
              </li>
            </ul>
            
            <Link to="/auth" className={`w-full block text-center py-4 rounded-full text-[14px] font-semibold transition-colors no-underline ${plan.popular ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

// --- FAQ ----------------------------------------------------------------------
const faqs = [
  { q: 'Is this affiliated with CBSE?', a: 'No. This is an independent educational guidance platform providing expert analysis.' },
  { q: 'Can marks decrease?', a: 'Yes, in official CBSE re-evaluation marks can decrease. This is why our analysis helps you decide if the risk is worth it.' },
  { q: 'Are uploads secure?', a: 'Yes, all files are encrypted and stored safely. Only experts review them.' },
  { q: 'How fast is the review?', a: 'We guarantee a 12-hour turnaround time for all recommendations.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-32 bg-[#F5F5F5]">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">FAQ</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-semibold text-gray-900 text-[15px]">{faq.q}</span>
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FiChevronDown size={20} className="text-gray-400" />
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-6 pb-6 pt-0 text-[14px] text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Premium Ouro-style Footer w/ Magnetic Letter Physics --------------------
const OuroFooter = () => {
  const [hov, setHov] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  // 9 letter refs: V E R i T a s C o -- must be declared individually (Rules of Hooks)
  const r0 = useRef(null), r1 = useRef(null), r2 = useRef(null);
  const r3 = useRef(null), r4 = useRef(null), r5 = useRef(null);
  const r6 = useRef(null), r7 = useRef(null), r8 = useRef(null);
  const letterRefs = [r0, r1, r2, r3, r4, r5, r6, r7, r8];
  const mouse = useRef({ x: 0, y: 0 });
  const springs = useRef(Array.from({ length: 9 }, () => ({ x: 0, y: 0, vx: 0, vy: 0 })));
  const rafId = useRef(null);
  const svgRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fontSizeRef = useRef(null); // cached computed font size for canvas glyph draw

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const STIFFNESS = 0.055;  // spring acceleration (lower = slower, more elastic)
    const DAMPING   = 0.62;   // velocity retention (lower = more bounce)
    const RADIUS    = 420;    // px -- huge influence zone like Ouro Labs
    const STRENGTH  = 1.9;    // displacement multiplier -- very strong pull
    const MAX_DISP  = 85;     // cap so letters don't fly off screen

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      letterRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // Use center of the bounding box (works correctly on SVG <g> elements)
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sp = springs.current[i];

        let targetX = 0, targetY = 0;
        if (dist < RADIUS && dist > 1) {
          // Smoothstep ease -- strongest near cursor, tapers at radius edge
          const normalized = 1 - dist / RADIUS;
          const eased = normalized * normalized * (3 - 2 * normalized);
          const force = eased * STRENGTH;
          // Negate: letters REPEL away from cursor (opposite of attraction)
          targetX = Math.max(-MAX_DISP, Math.min(MAX_DISP, -dx * force));
          targetY = Math.max(-MAX_DISP, Math.min(MAX_DISP, -dy * force));
        }

        // Spring physics: acceleration toward target, velocity damped each frame
        const ax = (targetX - sp.x) * STIFFNESS;
        const ay = (targetY - sp.y) * STIFFNESS;
        sp.vx = (sp.vx + ax) * DAMPING;
        sp.vy = (sp.vy + ay) * DAMPING;
        sp.x += sp.vx;
        sp.y += sp.vy;

        ref.current.style.transform = `translate(${sp.x.toFixed(2)}px, ${sp.y.toFixed(2)}px)`;
      });

      // -- Desktop only: dual-layer source-in video canvas --
      if (!isMobile) {
        const vid = videoRef.current;
        const cvs = canvasRef.current;
        if (vid && cvs && vid.readyState >= 2) {
          const cw = cvs.offsetWidth  || cvs.parentElement?.offsetWidth  || 300;
          const ch = cvs.offsetHeight || cvs.parentElement?.offsetHeight || 80;
          if (cvs.width !== cw || cvs.height !== ch) { cvs.width = cw; cvs.height = ch; }

          if (!fontSizeRef.current && r0.current)
            fontSizeRef.current = parseFloat(getComputedStyle(r0.current).fontSize) + 'px';
          const fs = fontSizeRef.current || '80px';

          const ctx = cvs.getContext('2d');
          ctx.clearRect(0, 0, cw, ch);
          const cb = cvs.getBoundingClientRect();
          const chars = 'VeritasCo'.split('');

          ctx.save();
          ctx.font = `900 ${fs} Outfit, Inter, sans-serif`;
          ctx.textBaseline = 'alphabetic';
          ctx.textAlign = 'left';
          ctx.fillStyle = '#fff';
          letterRefs.forEach((ref, i) => {
            if (!ref.current) return;
            const r = ref.current.getBoundingClientRect();
            ctx.fillText(chars[i], r.left - cb.left, r.bottom - cb.top);
          });
          ctx.globalCompositeOperation = 'source-in';
          ctx.drawImage(vid, 0, 0, cw, ch);
          ctx.restore();
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // Explicitly start video (browsers block autoplay on off-screen elements)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: 'mailto:info@veritasco.tech' },
    { label: 'Instagram', href: 'https://www.instagram.com/r_e_z_o_s_nd', external: true },
  ];

  return (
    <footer aria-label="VeritasCo" className="bg-[#F5F5F5] text-gray-900 relative overflow-hidden border-t border-gray-200">

      {/* Subtle ambient glow */}
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-80 h-64 bg-blue-500/5 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-10 sm:pt-14 md:pt-16 pb-8">

        {/* -- Top Row: Logo + CTA -- */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8 md:mb-12">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <img src="/veritasco.png" alt="VeritasCo"
                style={{ width: 28, height: 28, objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#111827', letterSpacing: '-0.02em' }}>
                VeritasCo
              </span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-[260px]">
              India&apos;s most trusted CBSE re-evaluation advisory.
            </p>
          </div>

          {/* CTA -- white pill with black border & black arrow */}
          <a
            href="/auth"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] font-semibold bg-white border border-gray-900 text-gray-900 transition-all hover:bg-gray-900 hover:text-white no-underline whitespace-nowrap shadow-sm"
          >
            Check My Chances
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* -- Giant Magnetic Wordmark -- */}
        <video
          ref={videoRef} src="/bg.mp4"
          autoPlay loop muted playsInline preload="auto"
          style={{ position: 'fixed', left: '-9999px', top: 0, width: 2, height: 2, opacity: 0.01, pointerEvents: 'none' }}
        />

        {/* -- Magnetic Wordmark -- */}
        <div
          ref={svgRef}
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(36px, 11vw, 230px)',
            overflow: 'visible',
            marginBottom: 24,
          }}
        >
          {/* Desktop only: canvas for source-in video dual-layer */}
          {!isMobile && (
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 3,
              }}
            />
          )}

          {/* Letters: yellow on mobile (single layer), yellow+video on desktop */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}>
            {'VeritasCo'.split('').map((char, i) => (
              <span
                key={i}
                ref={letterRefs[i]}
                style={{
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(28px, 9.5vw, 200px)',
                  background: 'linear-gradient(160deg, #f59e0b 0%, #d97706 60%, #92400e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  willChange: 'transform',
                  userSelect: 'none',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >{char}</span>
            ))}
          </div>
        </div>

        {/* -- Divider -- */}
        <div className="h-px bg-gray-200 mb-5" />

        {/* -- Footer Nav -- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* Links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((l) => (
              <a key={l.label} href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                onMouseEnter={() => setHov(l.label)}
                onMouseLeave={() => setHov(null)}
                style={{
                  color: hov === l.label ? '#111827' : '#6b7280',
                  textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  transition: 'color 0.2s',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:items-end gap-0.5">
            <span className="text-[11px] text-gray-400">Not affiliated with CBSE. Educational guidance only.</span>
            <span className="text-[12px] text-gray-500 font-medium">© {new Date().getFullYear()} VeritasCo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

// --- Main Landing Page --------------------------------------------------------
const LandingPage = () => (
  <div className="font-inter bg-[#F5F5F5] selection:bg-blue-100 selection:text-blue-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <MidStatement
      text="Don't guess. Get expert eyes on your paper"
      accent="before you decide."
      stats={[
        { value: '100+', label: 'Students' },
        { value: '4.9★', label: 'Rating' },
      ]}
    />
    <Features />
    <MidStatement
      text="Transparent pricing."
      accent="No hidden fees, ever."
      stats={[
        { value: '12hr', label: 'Turnaround' },
        { value: '95%', label: 'Accuracy' },
      ]}
    />
    <Pricing />
    <FAQ />
    <OuroFooter />
  </div>
);

export default LandingPage;
