import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiTrendingUp, FiMapPin, FiStar, FiZap, FiShield } from 'react-icons/fi';

const activities = [
  {
    id: 1,
    name: 'Aayush M.',
    city: 'Jaipur',
    subject: 'Physics (Class 12)',
    action: 'unlocked Premium Recheck analysis',
    result: '⚠️ Step-marking error spotted (+7 marks expected)',
    tag: 'Step Marking Error',
    tagColor: 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
    iconColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    icon: FiTrendingUp
  },
  {
    id: 2,
    name: 'Sneha K.',
    city: 'New Delhi',
    subject: 'Chemistry (Class 12)',
    action: 'upgraded to 2 Subjects Expert bundle',
    result: '✨ 100% genuine senior evaluator recommendation ready',
    tag: 'Senior Evaluator',
    tagColor: 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
    iconColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    icon: FiCheckCircle
  },
  {
    id: 3,
    name: 'Rohan N.',
    city: 'Bengaluru',
    subject: 'Mathematics (Class 10)',
    action: 'received Detailed Answer Sheet review',
    result: '🛡️ Saved ₹1,000 — expert recommended NOT to apply (low potential)',
    tag: 'Honest Advice',
    tagColor: 'bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/30',
    iconColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    icon: FiShield
  },
  {
    id: 4,
    name: 'Ananya R.',
    city: 'Kolkata',
    subject: 'Biology (Class 12)',
    action: 'obtained board evaluation guide checklist',
    result: '📈 Expected Marks Increase +6 after expert analysis',
    tag: 'High Potential',
    tagColor: 'bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-900/30',
    iconColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    icon: FiZap
  },
  {
    id: 5,
    name: 'Harsh S.',
    city: 'Chandigarh',
    subject: 'Business Studies (Class 12)',
    action: 'submitted response sheets for analysis',
    result: '⭐ Senior CBSE educator allocated for re-evaluation review',
    tag: 'Expert Assigned',
    tagColor: 'bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30',
    iconColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    icon: FiStar
  },
  {
    id: 6,
    name: 'Varun R.',
    city: 'Hyderabad',
    subject: 'Mathematics (Class 12)',
    action: 'upgraded to Premium Dynamic Bundle',
    result: '⚡ Checked answers matching official CBSE marking key',
    tag: 'Key Matched',
    tagColor: 'bg-red-50/60 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100/50 dark:border-red-900/30',
    iconColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    icon: FiZap
  }
];

const LiveActivityWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;

    // Show initial notification after 3 seconds
    const startTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Dynamic rotation loop
    const interval = setInterval(() => {
      setIsVisible(false);
      
      // Allow fade-out duration before changing index
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 800);

    }, 8500); // Rotates every 8.5 seconds

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [closed]);

  if (closed) return null;

  const current = activities[currentIndex];

  return (
    <div className="hidden sm:block fixed bottom-6 left-6 z-50 pointer-events-none max-w-sm w-[350px]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="pointer-events-auto relative overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-[24px] p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-black/[0.04] dark:border-white/[0.04] flex flex-col gap-3 group"
          >
            {/* Elegant Top Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-500/80 via-rose-500/80 to-amber-500/80" />

            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-500 flex items-center gap-1 font-inter">
                  Live Activity
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">• 100+ upgraded</span>
              </div>
              <button 
                onClick={() => {
                  setIsVisible(false);
                  setClosed(true);
                }}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors p-0.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 pointer-events-auto"
                aria-label="Close notification"
              >
                <FiX size={12} />
              </button>
            </div>

            {/* Body */}
            <div className="flex gap-3 items-start">
              {/* Profile Avatar / Subject Icon */}
              <div className="shrink-0 relative mt-0.5">
                <div className={`w-9 h-9 rounded-xl ${current.iconColor} flex items-center justify-center shadow-sm`}>
                  <current.icon size={16} />
                </div>
                {/* Micro Map Pin */}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-full p-0.5 text-slate-400 shadow-sm">
                  <FiMapPin size={8} />
                </div>
              </div>

              {/* Description Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">{current.name}</span>{' '}
                  <span className="text-slate-400 dark:text-slate-500 font-normal">({current.city})</span>{' '}
                  <span className="text-slate-500 dark:text-slate-400">{current.action}</span>{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{current.subject}</span>
                </p>
                
                {/* Live result / finding snippet */}
                <div className="mt-2 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-black/[0.02] dark:border-white/[0.02] text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 leading-snug">
                  {current.result}
                </div>
              </div>
            </div>

            {/* Footer with tag */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-2 mt-0.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${current.tagColor}`}>
                {current.tag}
              </span>
              <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500">
                Verified just now
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityWidget;
