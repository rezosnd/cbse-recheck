import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiHeart, FiStar } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = { show: { transition: { staggerChildren: 0.13 } } };

// ── Countdown to midnight ──────────────────────────────────────────────────────
const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  if (diff <= 0) return { h: '00', m: '00', s: '00' };
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  const pad = (n) => String(n).padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
};

const TimeBox = ({ value, label }) => (
  <motion.div
    variants={fadeUp}
    className="flex flex-col items-center"
  >
    <div className="relative">
      {/* Glassy card */}
      <div className="w-[72px] sm:w-[88px] h-[72px] sm:h-[88px] rounded-[20px] bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center">
        <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tighter font-outfit tabular-nums">
          {value}
        </span>
      </div>
      {/* Top separator line like a flip clock */}
      <div className="absolute top-1/2 left-3 right-3 h-px bg-gray-100 pointer-events-none" />
    </div>
    <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
  </motion.div>
);

// ── Floating particle dots ─────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  dur: 4 + Math.random() * 4,
  color: ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'][i % 5],
}));

export default function MaintenancePage() {
  const [time, setTime] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter relative overflow-hidden flex flex-col">

      {/* ── Floating particles ─────────────────────────────────────────── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.18,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.18, 0.35, 0.18] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Subtle top gradient blob ───────────────────────────────────── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full
        bg-gradient-to-br from-blue-100 via-purple-50 to-transparent opacity-60 blur-3xl pointer-events-none" />

      {/* ── Navbar brand strip ────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-center pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <img src="/veritasco.png" alt="Veritasco" className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="text-[15px] font-bold text-gray-800 tracking-wide">Veritasco</span>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-2xl w-full text-center"
        >

          {/* ── 🎉 Milestone badge ────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <div className="relative inline-flex items-center gap-3 px-6 py-3.5
              bg-white/80 backdrop-blur-md rounded-[20px] border border-black
              shadow-[0_12px_30px_-10px_rgba(0,0,0,0.12)]
              transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Paperclip */}
              <div className="absolute -top-3.5 -left-1 -rotate-12 text-black/80">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <div className="text-yellow-500 animate-bounce">
                <FiStar size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-gray-900 text-[13px] tracking-wide">
                🎉 300+ Copies Milestone Reached!
              </span>
            </div>
          </motion.div>

          {/* ── Heading ────────────────────────────────────────────────── */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6"
          >
            We've hit{' '}
            <span className="relative inline-block">
              <span className="relative z-10">300 copies!</span>
              <svg className="absolute left-0 -bottom-1 w-full h-[10px] text-yellow-300 -z-0" viewBox="0 0 200 10" preserveAspectRatio="none" fill="none">
                <path d="M2 8C60 3 140 3 198 7" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* ── Sub message ────────────────────────────────────────────── */}
          <motion.p
            variants={fadeUp}
            className="text-[17px] sm:text-[19px] text-gray-500 font-medium leading-relaxed mb-4 max-w-xl mx-auto"
          >
            Applications are temporarily paused. We are currently delivering
            reports to everyone who already paid — <strong className="text-gray-800">you are our priority.</strong>
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-[15px] text-gray-400 font-medium leading-relaxed mb-12 max-w-lg mx-auto"
          >
            New applications will reopen at{' '}
            <span className="font-bold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded-md">12:00 AM sharp</span>.
            Stay tuned — thank you for your patience! 🙏
          </motion.p>

          {/* ── Countdown ──────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">
              Reopens in
            </p>
            <motion.div variants={stagger} initial="hidden" animate="show"
              className="flex items-end justify-center gap-3 sm:gap-5">
              <TimeBox value={time.h} label="Hours" />
              <span className="text-4xl font-bold text-gray-300 mb-6 select-none">:</span>
              <TimeBox value={time.m} label="Minutes" />
              <span className="text-4xl font-bold text-gray-300 mb-6 select-none">:</span>
              <TimeBox value={time.s} label="Seconds" />
            </motion.div>
          </motion.div>

          {/* ── Status cards ───────────────────────────────────────────── */}
          <motion.div variants={fadeUp}
            className="grid sm:grid-cols-3 gap-4 mb-12 max-w-xl mx-auto">
            {[
              { icon: <FiCheckCircle className="text-green-500" size={20} />, title: 'Paid Orders', desc: 'Being delivered now', bg: 'bg-green-50 border-green-100' },
              { icon: <FiClock className="text-blue-500" size={20} />, title: 'New Orders', desc: 'Reopen at 12:00 AM', bg: 'bg-blue-50 border-blue-100' },
              { icon: <FiHeart className="text-rose-500" size={20} />, title: 'Our Promise', desc: 'Every report delivered', bg: 'bg-rose-50 border-rose-100' },
            ].map((c, i) => (
              <div key={i} className={`${c.bg} border rounded-[20px] p-4 text-left`}>
                <div className="mb-2">{c.icon}</div>
                <div className="font-bold text-[13px] text-gray-900 mb-0.5">{c.title}</div>
                <div className="text-[12px] text-gray-500 font-medium">{c.desc}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Paid user note ─────────────────────────────────────────── */}
          <motion.div variants={fadeUp}
            className="bg-white rounded-[24px] border border-gray-100 shadow-sm px-6 py-5 mb-10 max-w-lg mx-auto">
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">
              <strong className="text-gray-900">Already paid?</strong> Your report is being actively worked on.
              You'll receive it via email. For urgent queries reach us at{' '}
              <a href="mailto:info@veritasco.tech"
                className="text-blue-600 font-bold hover:underline">
                info@veritasco.tech
              </a>
            </p>
          </motion.div>

          {/* ── CTA to notify ──────────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <a
              href="mailto:info@veritasco.tech?subject=Notify me when open"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white
                text-[15px] font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5
                transition-all no-underline"
            >
              Notify Me When Open →
            </a>
            <p className="mt-4 text-[12px] text-gray-400 font-medium">
              We'll reply as soon as new slots are available.
            </p>
          </motion.div>

        </motion.div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 text-center py-6 border-t border-gray-100">
        <p className="text-[12px] text-gray-400 font-medium">
          © {new Date().getFullYear()} Veritasco · CBSE Recheck Advisor · Not affiliated with CBSE
        </p>
      </footer>

    </div>
  );
}
