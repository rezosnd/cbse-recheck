import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiEye, FiFilter, FiCopy, FiCheck } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import PageLoader from '../../components/PageLoader';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CopyEmailBtn = ({ email }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title={`Copy ${email}`}
      className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors align-middle"
    >
      {copied ? <FiCheck size={11} className="text-green-500" /> : <FiCopy size={11} />}
    </button>
  );
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [search, status]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/applications', {
        params: {
          search,
          status: status.startsWith('pay:') ? undefined : status || undefined,
          paymentStatus: status === 'pay:paid' ? 'paid' : status === 'pay:pending' ? 'pending' : undefined,
          limit: 10000
        }
      });
      setApplications(res.data.applications);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/applications/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Applications</h1>
            <p className="text-[15px] text-gray-500 font-medium mt-1">Manage and review student requests</p>
          </div>
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <FiDownload size={16} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[24px] p-4 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, name, email..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-56">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 pl-11 pr-8 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <optgroup label="─── App Status ───">
                <option value="submitted">Submitted</option>
                <option value="payment_verified">Payment Verified</option>
                <option value="under_review">Under Review</option>
                <option value="recommendation_ready">Recommendation Ready</option>
                <option value="completed">Completed</option>
              </optgroup>
              <optgroup label="─── Payment Status ───">
                <option value="pay:paid">Paid</option>
                <option value="pay:pending">Unpaid / Pending</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-gray-400 font-medium animate-pulse">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-medium">No applications found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400">
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider pl-8">Request ID</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Subjects</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-right pr-8">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4 pl-8">
                        <span className="font-bold text-[14px] text-gray-900">{app.requestId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[14px] text-gray-900">{app.studentName}</div>
                        <div className="text-[12px] text-gray-400 font-medium mt-0.5 flex items-center flex-wrap gap-x-1">
                          <span>{app.studentEmail}</span>
                          <CopyEmailBtn email={app.studentEmail} />
                          {app.studentMobile && <span className="text-gray-500">• {app.studentMobile}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-gray-500">
                        {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-[12px] font-bold">
                          {Array.isArray(app.subjects) ? app.subjects.length : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.paymentStatus === 'paid' ? 'paid' : 'pending'} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <Link to={`/admin/applications/${app._id}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors no-underline">
                          <FiEye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default AdminApplications;
