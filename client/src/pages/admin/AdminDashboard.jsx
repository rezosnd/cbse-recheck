import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiCheckCircle, FiClock, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import PageLoader from '../../components/PageLoader';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EmailListCard = ({ title, emails = [] }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(emails.join(', '));
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/30 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-bold text-gray-900">{title}</h3>
        <span className="text-[12px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{emails.length}</span>
      </div>
      <div className="text-[12px] text-gray-500 font-medium mb-4 flex-1 line-clamp-3 break-all">
        {emails.length > 0 ? emails.join(', ') : 'No emails found'}
      </div>
      <button 
        onClick={handleCopy}
        disabled={emails.length === 0}
        className="mt-auto w-full py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        Copy All
      </button>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
    className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
      <div className="text-[13px] font-medium text-gray-500 mt-1">{label}</div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const { stats, recentApplications, recentPayments, topReferrers } = data;

  const statCards = [
    { icon: FiFileText, label: 'Total Applications', value: stats.totalApplications, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FiUsers, label: 'Total Students', value: stats.totalUsers, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: FiClock, label: 'Pending Reviews', value: stats.pendingApplications, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: FiDollarSign, label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-[15px] text-gray-500 font-medium mt-1">Monitor applications and revenue</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Recent Applications */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <Link to="/admin/applications" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/20 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Link to={`/admin/applications/${app._id}`} className="font-bold text-[14px] text-gray-900 hover:text-blue-600 no-underline">
                        {app.requestId}
                      </Link>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <div className="text-[12px] font-medium text-gray-500">
                      {app.userId?.name} • {app.subjects?.length} subjects
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-gray-900">{format(new Date(app.createdAt), 'MMM dd')}</div>
                    <div className="text-[12px] font-medium text-gray-400 mt-0.5">₹{app.paymentAmount}</div>
                  </div>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <p className="text-[13px] text-center text-gray-400 font-medium py-8">No recent applications</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-8">Recent Payments</h2>
            
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-green-50 text-green-600">
                      <FiCheckCircle size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-gray-900">{payment.userId?.name || 'Unknown'}</div>
                      <div className="text-[11px] font-medium text-gray-400 mt-0.5">{payment.orderId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold text-green-600">+₹{payment.amount}</div>
                    <div className="text-[11px] font-semibold text-gray-400 mt-0.5">{format(new Date(payment.createdAt), 'MMM dd')}</div>
                  </div>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <p className="text-[13px] text-center text-gray-400 font-medium py-8">No recent payments</p>
              )}
            </div>
          </div>

        </div>

        {/* Top Referrers */}
        {topReferrers && topReferrers.length > 0 && (
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-8">Top Referrers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topReferrers.map((user, idx) => (
                <div key={user._id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] text-gray-900 truncate">{user.name}</div>
                    <div className="text-[12px] text-gray-500 truncate">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-bold text-gray-900">{user.referralCount}</div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase">Referrals</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Lists */}
        {data.emailLists && (
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-8">Email Segments</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <EmailListCard title="Registered, No Application" emails={data.emailLists.loginNotInitiate} />
              <EmailListCard title="Application Paid" emails={data.emailLists.paid} />
              <EmailListCard title="Applied, Not Paid" emails={data.emailLists.initiatedNotPaid} />
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
