import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiClock, FiDownload, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data.application);
    } catch (err) {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const existingCount = app.uploadedFiles?.length || 0;
    const requiredCount = app.subjects.length;
    const needed = requiredCount - existingCount;

    if (existingCount >= requiredCount) {
      toast.error('You have already uploaded all required documents.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (files.length !== needed) {
      toast.error(`Please select exactly ${needed} document(s) (one for each remaining subject).`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const formData = new FormData();
    validFiles.forEach(file => formData.append('files', file));
    formData.append('fileType', 'answerSheet');

    setUploading(true);
    try {
      await api.post(`/applications/${id}/upload-files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Files uploaded successfully');
      fetchApplication();
    } catch (err) {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    const toastId = toast.loading('Preparing download...');
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Download error:', err);
      toast.dismiss(toastId);
      window.open(fileUrl, '_blank');
    }
  };

  if (loading) return <PageLoader />;
  if (!app) return <div className="text-center pt-36 md:pt-40 font-inter text-gray-500">Application not found.</div>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-16 px-4 md:px-8 flex-1">
        
        <Link to="/dashboard" className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 mb-6 no-underline">
          <FiArrowLeft /> Back to Dashboard
        </Link>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                {app.requestId}
              </h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-[13px] font-medium text-gray-500">
              Submitted on {format(new Date(app.createdAt), 'MMM dd, yyyy, hh:mm a')}
            </p>
          </div>
          <Link to={`/messages?app=${app._id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors no-underline">
            <FiMessageSquare size={16} /> Contact Support
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recommendation Result */}
            {(app.status === 'recommendation_ready' || app.status === 'completed') && app.recommendation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[5px] bg-purple-600" />
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-600 shrink-0">
                    <FiCheckCircle size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Expert Recommendation</h2>
                </div>
                <div className="text-[15px] leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                  {app.recommendation}
                </div>
              </motion.div>
            )}

            {/* Subjects */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Subjects Reviewed</h3>
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

            {/* Reason */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reason for Recheck</h3>
              <p className="text-[15px] leading-relaxed text-gray-500 font-medium">{app.reason}</p>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Upload Section */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Documents</h3>
              
              <div className="space-y-3 mb-6">
                {app.uploadedFiles?.map(file => (
                  <div key={file._id} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FiFileText size={18} className="text-blue-600 shrink-0" />
                      <span className="text-[13px] truncate font-semibold text-gray-700">{file.fileName}</span>
                    </div>
                    <button onClick={() => handleDownload(file.fileUrl, file.fileName)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                      <FiDownload size={16} />
                    </button>
                  </div>
                ))}
                
                {(!app.uploadedFiles || app.uploadedFiles.length === 0) && (
                  <div className="text-[13px] text-center py-6 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-medium">
                    No documents uploaded yet
                  </div>
                )}
              </div>

              {app.status === 'submitted' && (
                <div className="text-center py-6 px-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-[13px] font-semibold text-red-600 mb-1">Payment Required</p>
                  <p className="text-[12px] text-red-500 font-medium">You must complete your payment before uploading documents.</p>
                </div>
              )}

              {app.status !== 'submitted' && app.status !== 'completed' && app.status !== 'rejected' && (
                <>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-3.5 rounded-full bg-black text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {uploading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : <FiUploadCloud size={18} />}
                    {uploading ? 'Uploading...' : 'Upload Answer Sheets'}
                  </button>
                  <p className="text-[11px] text-center mt-3 text-gray-400 font-medium">Max size: 10MB. Formats: PDF, JPG, PNG</p>
                </>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Application Status</h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute top-2 bottom-2 left-2 w-[1px] bg-gray-100"></div>
                
                {[
                  { id: 'submitted', label: 'Application Submitted', done: true },
                  { id: 'payment_verified', label: 'Payment Verified', done: ['payment_verified', 'under_review', 'recommendation_ready', 'completed'].includes(app.status) },
                  { id: 'under_review', label: 'Under Expert Review', done: ['under_review', 'recommendation_ready', 'completed'].includes(app.status) },
                  { id: 'recommendation_ready', label: 'Recommendation Ready', done: ['recommendation_ready', 'completed'].includes(app.status) },
                ].map((step) => (
                  <div key={step.id} className="relative">
                    <div className={`absolute -left-[27px] w-4 h-4 rounded-full border-2 ${
                      step.done ? 'border-[#2563eb] bg-[#2563eb]' : 'border-gray-200 bg-white'
                    }`} style={{ top: '2px' }}>
                    </div>
                    <div className={`text-[14px] font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationDetail;
