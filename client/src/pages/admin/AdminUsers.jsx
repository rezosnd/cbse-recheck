import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMail } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import PageLoader from '../../components/PageLoader';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', { params: { search, limit: 10000 } });
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Students</h1>
          <p className="text-[15px] text-gray-500 font-medium mt-1">Manage all registered students</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-[24px] p-4 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email, or roll number..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table/List */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-gray-400 font-medium animate-pulse">Loading students...</div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-medium">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400">
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider pl-8">Name</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Stream</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-center">Code</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-center">Referrals</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-right pr-8">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-6 py-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                            {user.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[14px] text-gray-900">{user.name}</div>
                            <div className="text-[12px] text-gray-400 font-medium mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-gray-500">
                        {user.rollNo || '-'}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-gray-500">
                        {user.stream || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-[12px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold">
                          {user.referralCode || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-1 min-w-[28px] h-[24px] rounded-md text-[12px] font-bold ${user.referralCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {user.referralCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-semibold text-gray-500">
                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <a href={`mailto:${user.email}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors no-underline">
                          <FiMail size={14} /> Email
                        </a>
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

export default AdminUsers;
