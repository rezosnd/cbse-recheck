import { useState } from 'react';
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

// ─── Hero Section ──────────────────────────────────────────────────────────────
const Hero = () => (
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

          <motion.div 
            variants={fadeUp} 
            className="hidden sm:flex mt-8 p-5 rounded-[24px] bg-white/70 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/[0.03] backdrop-blur-md max-w-lg mx-auto lg:mx-0 shadow-[0_12px_40px_rgba(0,0,0,0.01)] flex-col gap-4"
          >
            {/* Top row with tags */}
            <div className="flex items-center justify-between border-b border-black/[0.03] dark:border-white/[0.03] pb-3">
              {/* Pulse Indicator badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-extrabold tracking-wider uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                Live Activity
              </div>
              {/* Star Rating Badge */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 ml-1">4.9/5 Student Rating</span>
              </div>
            </div>

            {/* Bottom row with avatar stack & copy */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar Stack */}
              <div className="flex -space-x-3 shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-pink-500/10 to-rose-400/10 text-rose-600 dark:text-rose-400 border border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-extrabold shadow-sm select-none">AM</div>
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-blue-600/10 to-cyan-400/10 text-blue-600 dark:text-cyan-400 border border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-extrabold shadow-sm select-none">SK</div>
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-amber-500/10 to-yellow-400/10 text-amber-600 dark:text-amber-400 border border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-extrabold shadow-sm select-none">RN</div>
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-emerald-500/10 to-teal-400/10 text-emerald-600 dark:text-emerald-400 border border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-extrabold shadow-sm select-none">AR</div>
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-slate-900 dark:bg-slate-800 text-yellow-400 flex items-center justify-center text-[9px] font-black shadow-sm select-none">100+</div>
              </div>

              {/* Trust and Activity Info */}
              <div className="text-center sm:text-left">
                <p className="text-[12.5px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join <span className="text-slate-900 dark:text-white font-extrabold border-b border-dashed border-red-500/40 pb-0.5">100+ verified students</span> who already upgraded to our premium senior educator evaluation path.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500">

            <div className="flex items-center gap-2">
              <FiShield className="text-green-500" /> Secure Uploads
            </div>
            <div className="flex items-center gap-2">
              <FiAward className="text-yellow-600" /> Checked by Top Educators
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-purple-500" /> 100% Genuine Review
            </div>
            <div className="flex items-center gap-2">
              <FiLock className="text-gray-900" /> Razorpay Protected
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
                  <div className="font-semibold text-gray-900 leading-tight">Physics — Class 12</div>
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

// ─── How It Works ──────────────────────────────────────────────────────────────
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

// ─── Features ─────────────────────────────────────────────────────────────────
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

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  { subjects: 1, price: 29, label: '1 Subject' },
  { subjects: 2, price: 40, label: '2 Subjects', popular: true },
  { subjects: '3+', price: 49, label: '3+ Subjects' },
];

const Pricing = () => (
  <section id="pricing" className="py-32 bg-white">
    <div className="container-max max-w-5xl">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Transparent Pricing</h2>
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
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold tracking-tighter">₹{plan.price}</span>
              <span className={`text-[13px] ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/ one-time</span>
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

// ─── FAQ ──────────────────────────────────────────────────────────────────────
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

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="pt-24 pb-12 bg-white border-t border-gray-100">
    <div className="container-max max-w-6xl">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/veritasco.png" alt="Veritasco" className="w-10 h-10 object-contain" />
            <h3 className="text-xl font-bold text-gray-900 font-outfit">Veritasco Recheck</h3>
          </div>
          <p className="text-[15px] text-gray-500 mb-6 max-w-md leading-relaxed">
            Need assistance regarding CBSE re-evaluation guidance? <br/>We’re here to help.
          </p>
          <div className="space-y-4">
            <div>
              <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Support</div>
              <a href="mailto:info@veritasco.tech" className="text-[15px] font-medium text-gray-900 hover:text-blue-600 transition-colors">info@veritasco.tech</a>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</div>
              <a href="tel:+918709442363" className="text-[15px] font-medium text-gray-900 hover:text-blue-600 transition-colors">8709442363</a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Important Info</h4>
          <p className="text-[13px] text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <strong>Note:</strong> Phone support may not always be available. For faster responses and detailed assistance, please contact us through email.
          </p>
          <div className="mt-6">
            <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Support Hours</div>
            <div className="text-[14px] font-medium text-gray-900">10:00 AM – 8:00 PM IST</div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {['Home', 'Features', 'How it Works', 'Pricing', 'FAQ'].map(link => (
              <li key={link}>
                <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  {link}
                </a>
              </li>
            ))}
            <li><Link to="/auth" className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Login / Register</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-[13px] text-gray-400 font-medium">
            © {new Date().getFullYear()} Veritasco Recheck. All rights reserved.
          </p>
          <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <span>Designed by</span>
            <a
              href="https://www.instagram.com/r_e_z_o_s_nd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors font-bold underline decoration-wavy decoration-blue-500/30"
            >
              rezosnd
            </a>
          </div>
        </div>
        <div className="text-[12px] text-gray-500 border border-gray-100 px-4 py-2 rounded-full bg-gray-50 font-medium">
          Disclaimer: This platform is not affiliated with CBSE. Educational guidance platform only.
        </div>
      </div>
    </div>
  </footer>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="font-inter bg-[#F5F5F5] selection:bg-blue-100 selection:text-blue-900">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Features />
    <Pricing />
    <FAQ />
    <Footer />
    <LiveActivityWidget />
  </div>
);

export default LandingPage;

