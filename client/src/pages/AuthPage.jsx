import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FiHash, FiArrowRight, FiArrowLeft, FiCheckCircle, FiUser } from 'react-icons/fi';

const STREAMS = ['Science', 'Commerce', 'Arts', 'Other'];

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Google Login, 2 = Complete Profile
  const [googleData, setGoogleData] = useState(null); // stores { credential, email, name }
  const [form, setForm] = useState({ rollNo: '', stream: 'Science' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // First try to log in
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
        clientId: credentialResponse.clientId
      });

      if (res.data.requireDetails) {
        // User is authentic, but new. Needs to complete profile.
        setGoogleData(res.data.googleData);
        setStep(2);
        toast('Please complete your profile to register.', { icon: <FiUser size={16} /> });
      } else {
        // Normal login success
        login(res.data.user, res.data.token);
        toast.success(`Welcome back${res.data.user.name ? `, ${res.data.user.name}` : ''}!`);
        navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        credential: googleData.credential,
        rollNo: form.rollNo,
        stream: form.stream
      };
      
      const res = await api.post('/auth/google-register', payload);
      
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center items-center p-6 relative selection:bg-blue-100 selection:text-blue-900 font-inter">
      
      {/* Top Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img src="/veritasco.png" alt="Veritasco" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-bold text-gray-900 text-[15px] font-outfit hidden sm:block">Veritasco Recheck</span>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
          
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-outfit tracking-tight mb-2">
              {step === 1 ? 'Welcome' : 'Complete Profile'}
            </h2>
            <p className="text-[14px] text-gray-500 font-medium">
              {step === 1 ? 'Sign in securely with your Google account' : `Hi ${googleData?.name?.split(' ')[0] || ''}, almost done!`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="google-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex flex-col gap-6 items-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google Login Failed')}
                    useOneTap
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    width="300"
                    text="continue_with"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="complete-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleCompleteRegistration} className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-1">Account Email</label>
                    <div className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-[14px] rounded-2xl py-3.5 px-4 font-medium select-none">
                      {googleData?.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-1">CBSE Roll Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })}
                        placeholder="Ex: 12345678" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 ml-1">Stream</label>
                    <select value={form.stream} onChange={e => setForm({ ...form, stream: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none">
                      {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-full py-4 text-[14px] font-semibold mt-6 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
                    {loading ? 'Creating Account...' : 'Complete Registration'} {!loading && <FiCheckCircle />}
                  </button>
                  
                  <button type="button" onClick={() => setStep(1)} className="w-full text-center text-[13px] text-gray-500 hover:text-gray-900 mt-4 flex items-center justify-center gap-2">
                    <FiArrowLeft /> Back to login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-8 font-medium px-4">
          By continuing, you agree that this platform is not affiliated with CBSE. Educational guidance only.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
