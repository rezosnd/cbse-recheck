import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Footer from '../components/Footer';
import { FiFileText, FiClock, FiCheckCircle, FiPlus, FiArrowRight, FiInbox, FiInfo, FiCopy, FiGift } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[20px] p-4 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 transition-transform hover:-translate-y-1">
    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
      <div className="text-[12px] sm:text-[13px] font-medium text-gray-500 mt-0.5 leading-tight">{label}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, completed: 0, hasPaidApplication: false, referralCount: 0 });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/applications/stats'),
          api.get('/applications?limit=5'),
        ]);
        setStats({
          ...statsRes.data.stats,
          hasPaidApplication: statsRes.data.recentPayments && statsRes.data.recentPayments.length > 0
        });
        setApplications(appsRes.data.applications);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: FiFileText, label: 'Total Applications', value: stats.total, color: 'text-gray-900', bg: 'bg-gray-100' },
    { icon: FiClock, label: 'Pending / Submitted', value: stats.pending, color: 'text-gray-900', bg: 'bg-gray-100' },
    { icon: FiInbox, label: 'Under Review', value: stats.underReview, color: 'text-gray-900', bg: 'bg-gray-100' },
    { icon: FiCheckCircle, label: 'Completed', value: stats.completed, color: 'text-gray-900', bg: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-12 px-4 sm:px-6 md:px-8 flex-1">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[13px] sm:text-[15px] text-gray-500 font-medium leading-snug">
              Track your applications and review expert recommendations.
            </p>
          </div>
          <Link to="/apply" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white text-[14px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline shrink-0">
            <FiPlus size={16} /> New Application
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <div className="mb-8 px-4 py-3 sm:px-5 sm:py-4 rounded-[16px] sm:rounded-[20px] bg-gray-50 border border-gray-200 flex items-start sm:items-center gap-3 shadow-sm">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <FiInfo className="text-gray-700" size={14} />
          </div>
          <p className="text-[13px] sm:text-[14px] text-gray-700 font-medium leading-snug">
            <strong>Disclaimer:</strong> This platform is not affiliated with CBSE. Educational guidance only.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-12">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Referral Card */}
        {stats.hasPaidApplication && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mb-8 sm:mb-12">
            <div className="relative w-full px-5 py-6 sm:px-8 sm:py-7 bg-white rounded-[20px] sm:rounded-[24px] border border-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-6 transform hover:-translate-y-1 transition-transform duration-300">
              
              {/* Paper clip */}
              <div className="absolute -top-3.5 -left-1 transform -rotate-12 text-black/80">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>

              <div className="text-center md:text-left flex-1 mt-2 sm:mt-0">
                <h2 className="text-2xl sm:text-[28px] font-bold mb-3 text-gray-900 font-inter tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 justify-center md:justify-start">
                  Invite friends for
                  <span className="relative z-10 font-extrabold text-amber-950 font-caveat text-3xl sm:text-4xl pb-1 leading-none ml-1">
                    cool rewards
                    <svg className="absolute left-0 bottom-1 w-full h-[7px] text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9C30 9 70 3 99 7C70 8 30 7 2 5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </span>
                </h2>
                <p className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed max-w-lg mx-auto md:mx-0">
                  Share your link with friends. You currently have <strong className="text-gray-900 font-bold underline decoration-yellow-400 decoration-2 underline-offset-2">{stats.referralCount !== undefined ? stats.referralCount : (user?.referralCount || 0)}</strong> successful referrals! Share with friends and on <strong className="text-black font-bold">5 successful payments</strong> you get a <strong className="text-black font-bold">100% refund!</strong>
                </p>
              </div>
              
              <div className="flex flex-col w-full md:w-auto shrink-0 gap-2 sm:gap-3">
                <div className="text-[11px] sm:text-[12px] text-gray-500 font-bold uppercase tracking-widest text-center md:text-right">Your Referral Code</div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 text-center font-mono font-bold text-[17px] tracking-[0.15em] text-gray-900 shadow-sm">
                    {user?.referralCode || '----'}
                  </div>
                  <button 
                    onClick={() => {
                      if (user?.referralCode) {
                        navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${user.referralCode}`);
                        import('react-hot-toast').then(m => m.default.success('Referral link copied! 🚀'));
                        import('canvas-confetti').then(confetti => {
                          confetti.default({
                            particleCount: 150,
                            spread: 80,
                            origin: { y: 0.6 },
                            colors: ['#000000', '#facc15', '#3b82f6']
                          });
                        });
                      }
                    }}
                    className="bg-black text-white rounded-xl px-6 py-3.5 font-bold text-[14px] sm:text-[15px] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
                  >
                    <FiCopy size={16} /> Copy Link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Applications</h2>
            <Link to="/apply" className="text-[13px] sm:text-[14px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline">
              View All <FiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 sm:h-24 bg-gray-50 animate-pulse rounded-2xl" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 border-[6px] border-white shadow-sm flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FiFileText size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-[13px] sm:text-[14px] text-gray-500 mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed px-4">
                Start by submitting your first recheck application to get expert analysis.
              </p>
              <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-[14px] font-semibold hover:bg-gray-800 transition-colors no-underline">
                <FiPlus size={16} /> Apply Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {applications.map((app, i) => (
                <motion.div key={app._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">

                  {/* Row 1: Request ID + Arrow */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FiFileText size={15} className="text-blue-600" />
                      </div>
                      <span className="font-bold text-[14px] sm:text-[15px] text-gray-900 truncate">{app.requestId}</span>
                    </div>
                    <Link to={`/application/${app._id}`}
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-colors shrink-0">
                      <FiArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Row 2: Status badge + Amount */}
                  <div className="flex items-center justify-between gap-2 mb-2 pl-[42px]">
                    <StatusBadge status={app.status} size="sm" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">₹</span>
                      <span className="text-[15px] font-bold text-gray-900">{app.paymentAmount}</span>
                    </div>
                  </div>

                  {/* Row 3: Subject + Date */}
                  <div className="flex items-center justify-between gap-2 pl-[42px]">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md text-[11px] sm:text-[12px] text-gray-600 font-medium truncate max-w-[160px] sm:max-w-[260px]">
                      {app.subjects?.map(s => s.subject).join(', ')}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium shrink-0">
                      {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>

                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
