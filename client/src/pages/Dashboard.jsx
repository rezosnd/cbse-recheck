import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Footer from '../components/Footer';
import { FiFileText, FiClock, FiCheckCircle, FiPlus, FiArrowRight, FiInbox, FiInfo } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
      <div className="text-[13px] font-medium text-gray-500 mt-1">{label}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, completed: 0 });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/applications/stats'),
          api.get('/applications?limit=5'),
        ]);
        setStats(statsRes.data.stats);
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
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[15px] text-gray-500 font-medium">
              Track your applications and review expert recommendations.
            </p>
          </div>
          <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-[14px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline shrink-0">
            <FiPlus size={16} /> New Application
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <div className="mb-10 px-5 py-4 rounded-[20px] bg-gray-50 border border-gray-200 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <FiInfo className="text-gray-700" size={16} />
          </div>
          <p className="text-[14px] text-gray-700 font-medium">
            <strong>Disclaimer:</strong> This platform is not affiliated with CBSE. Educational guidance only.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <Link to="/apply" className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 no-underline">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 border-[6px] border-white shadow-sm flex items-center justify-center mx-auto mb-6">
                <FiFileText size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-[14px] text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                Start by submitting your first recheck application to get expert analysis.
              </p>
              <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-[14px] font-semibold hover:bg-gray-800 transition-colors no-underline">
                <FiPlus size={16} /> Apply Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, i) => (
                <motion.div key={app._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} 
                  className="p-5 rounded-[24px] border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FiFileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                          <span className="font-bold text-[15px] text-gray-900">{app.requestId}</span>
                          <StatusBadge status={app.status} size="sm" />
                        </div>
                        <div className="text-[13px] font-medium text-gray-500 flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{app.subjects?.map(s => s.subject).join(', ')}</span>
                          <span>•</span>
                          <span>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                      <div className="flex flex-col text-right">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</span>
                        <span className="text-[15px] font-bold text-gray-900">₹{app.paymentAmount}</span>
                      </div>
                      <Link to={`/application/${app._id}`}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-colors">
                        <FiArrowRight size={16} />
                      </Link>
                    </div>
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
