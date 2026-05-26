import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiSave, FiCheckCircle, FiFileText } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import PageLoader from '../../components/PageLoader';
import Footer from '../../components/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [sendingRec, setSendingRec] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/admin/applications/${id}`);
      setApp(res.data.application);
      setStatus(res.data.application.status);
      setAdminNotes(res.data.application.adminNotes || '');
      setRecommendation(res.data.application.recommendation || '');
    } catch (err) {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setSavingStatus(true);
    try {
      const res = await api.patch(`/admin/applications/${id}/status`, { status, adminNotes });
      setApp(res.data.application);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSendRecommendation = async () => {
    if (recommendation.trim().length < 10) return toast.error('Recommendation too short');
    setSendingRec(true);
    try {
      const res = await api.patch(`/admin/applications/${id}/recommendation`, { recommendation });
      setApp(res.data.application);
      setStatus(res.data.application.status);
      toast.success('Recommendation sent to student');
    } catch (err) {
      toast.error('Failed to send recommendation');
    } finally {
      setSendingRec(false);
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    try {
      toast.success('Opening document securely...');
      // Since your mobile network/ISP is blocking Cloudinary directly ("This site can't be reached")
      // and Cloudinary blocks backend proxies, we use the official Google Docs PDF Viewer.
      // Google's servers will download the PDF from Cloudinary on your behalf and render it securely,
      // completely bypassing your local network block!
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`;
      window.location.assign(googleDocsUrl);
    } catch (err) {
      console.error('Download error:', err);
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`;
      window.location.assign(googleDocsUrl);
    }
  };

  if (loading) return <PageLoader />;
  if (!app) return <div className="text-center pt-36 md:pt-40 font-inter text-gray-500">Application not found</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        <Link to="/admin/applications" className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 mb-6 no-underline">
          <FiArrowLeft /> Back to Applications
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {app.requestId}
              </h1>
              <StatusBadge status={app.status} />
              <StatusBadge status={app.paymentStatus === 'paid' ? 'paid' : 'pending'} />
            </div>
            <p className="text-[14px] text-gray-500 font-medium">
              Submitted by <strong className="text-gray-700">{app.studentName}</strong> ({app.studentEmail}) {app.studentMobile && <span> • Contact: <strong className="text-gray-700">{app.studentMobile}</strong></span>}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Subjects Table */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Subjects & Marks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="pb-3 text-[12px] font-bold uppercase tracking-wider pl-2">Subject</th>
                      <th className="pb-3 text-[12px] font-bold uppercase tracking-wider">Current Marks</th>
                      <th className="pb-3 text-[12px] font-bold uppercase tracking-wider pr-2">Expected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {app.subjects.map((sub, i) => (
                      <tr key={i} className="text-gray-700">
                        <td className="py-4 text-[14px] font-bold text-gray-900 pl-2">{sub.subject}</td>
                        <td className="py-4 text-[14px] font-semibold text-gray-500">{sub.currentMarks}</td>
                        <td className="py-4 text-[14px] font-semibold text-gray-500 pr-2">{sub.expectedMarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student's Reason */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Student's Reason</h2>
              <div className="p-5 rounded-2xl text-[14px] leading-relaxed text-gray-600 bg-gray-50/50 font-medium">
                {app.reason}
              </div>
            </div>

            {/* Expert Recommendation Input */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[5px] bg-purple-600" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-600 shrink-0">
                  <FiCheckCircle size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Expert Recommendation</h2>
              </div>
              <p className="text-[13px] text-purple-700/80 mb-6 font-semibold bg-purple-50/50 px-4 py-2.5 rounded-xl border border-purple-100 inline-block">
                Write your detailed evaluation below. The student will be notified immediately upon submission.
              </p>
              
              <textarea 
                rows={8}
                value={recommendation}
                onChange={e => setRecommendation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl p-4 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium resize-none mb-6"
                placeholder="E.g., Physics: Re-evaluation Recommended. Reason: The step marking is missing on Page 4..."
              />
              
              <button 
                onClick={handleSendRecommendation}
                disabled={sendingRec}
                className="w-full bg-purple-600 text-white rounded-full py-4 text-[14px] font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(124,58,237,0.1)]"
              >
                {sendingRec ? 'Sending...' : 'Send Recommendation to Student'}
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Manage Status */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Manage Status</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Current Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="payment_verified">Payment Verified</option>
                    <option value="under_review">Under Review</option>
                    <option value="recommendation_ready">Recommendation Ready</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Internal Admin Notes</label>
                  <textarea 
                    rows={4}
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl p-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                    placeholder="Private notes (students won't see this)"
                  />
                </div>
                
                <button 
                  onClick={handleUpdateStatus}
                  disabled={savingStatus}
                  className="w-full bg-black text-white rounded-full py-3.5 text-[14px] font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FiSave size={16} /> {savingStatus ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Uploaded Documents</h2>
              
              <div className="space-y-4">
                {app.subjects.map((sub, index) => {
                  // Match file by explicit subject name, or fallback to index matching for older files
                  let file = app.uploadedFiles?.find(f => f.subject === sub.subject);
                  if (!file && app.uploadedFiles && app.uploadedFiles[index]) {
                    file = app.uploadedFiles[index];
                  }
                  
                  return (
                    <div key={index} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-gray-900 truncate pr-2" title={sub.subject}>
                          {sub.subject}
                        </span>
                        {file ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                            ✓ Uploaded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                            Pending
                          </span>
                        )}
                      </div>
                      
                      {file ? (
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FiFileText size={16} className="text-blue-600 shrink-0" />
                            <span className="text-[12px] truncate font-medium text-gray-600">{file.fileName}</span>
                          </div>
                          <button 
                            onClick={() => handleDownload(file.fileUrl, file.fileName)} 
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                            title="Download Answer Sheet"
                          >
                            <FiDownload size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[12px] text-gray-400 font-medium italic pl-1">
                          No file uploaded yet for this subject.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminApplicationDetail;
