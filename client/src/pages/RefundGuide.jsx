import { motion } from 'framer-motion';
import { FiCheckCircle, FiCopy, FiShare2, FiUsers, FiGift } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RefundGuide = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-28 flex flex-col">
      <Navbar />
      
      <div className="container-max max-w-4xl mx-auto px-4 md:px-8 flex-1 flex flex-col items-center pb-20">
        
        {/* --- CONTENT CONTAINER --- */}
        <div className="w-full bg-white shadow-xl rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 md:p-12 relative border border-gray-100 mt-4 md:mt-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-gray-100 pb-8 mb-10 gap-4">
            <div className="flex items-center gap-3">
              <img src="/veritasco.png" alt="Logo" className="w-12 h-12" />
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>VeritasCo</h1>
            </div>
            <div className="md:text-right">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Caveat, cursive', fontSize: '2.5rem' }}>100% Refund Program</h2>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">Official Guide</p>
            </div>
          </div>

          {/* Intro Section */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">How to Get a Complete Refund?</h3>
            <p className="text-blue-800 leading-relaxed text-lg">
              Want your analysis for free? Participate in our Referral Program! 
              When you refer <strong className="font-extrabold text-blue-900">5 friends</strong> and they complete a successful payment (for ₹44, ₹74, or ₹114 plans), you automatically get a <strong className="font-extrabold text-blue-900">100% full refund</strong> on your original purchase.
            </p>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-10">
            
            {/* Step 1 */}
            <div className="flex gap-4 md:gap-6 items-start relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg md:text-xl shrink-0 z-10 shadow-md">1</div>
              <div className="absolute left-5 md:left-6 top-10 md:top-12 bottom-[-40px] w-0.5 bg-gray-200"></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiUsers className="text-blue-500" /> Go to Your Dashboard
                </h4>
                <p className="text-gray-600 mb-6">Log in to your account and navigate to the Dashboard section. You'll find your referral card at the top.</p>
                
                {/* Embedded Dashboard Referral Card UI Replicated */}
                <div className="relative w-full px-5 py-6 sm:px-8 sm:py-7 bg-white rounded-[20px] sm:rounded-[24px] border border-black shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl">
                  {/* Paper clip */}
                  <div className="absolute -top-3.5 -left-1 transform -rotate-12 text-black/80">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </div>

                  <div className="text-center md:text-left flex-1 mt-2 sm:mt-0 w-full min-w-0">
                    <h2 className="text-2xl sm:text-[28px] font-bold mb-3 text-gray-900 tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 justify-center md:justify-start" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Invite friends for
                      <span className="relative z-10 font-extrabold text-amber-950 text-3xl sm:text-4xl pb-1 leading-none ml-1" style={{ fontFamily: 'Caveat, cursive' }}>
                        cool rewards
                        <svg className="absolute left-0 bottom-1 w-full h-[7px] text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 9C30 9 70 3 99 7C70 8 30 7 2 5" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </h2>
                    <p className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed max-w-lg mx-auto md:mx-0">
                      Share your link with friends. You currently have <strong className="text-gray-900 font-bold underline decoration-yellow-400 decoration-2 underline-offset-2">0</strong> successful referrals! Share with friends and on <strong className="text-black font-bold">5 successful payments</strong> you get a <strong className="text-black font-bold">100% refund!</strong>
                    </p>
                  </div>
                  
                  <div className="flex flex-col w-full md:w-auto shrink-0 gap-2 sm:gap-3">
                    <div className="text-[11px] sm:text-[12px] text-gray-500 font-bold uppercase tracking-widest text-center md:text-right">Your Referral Code</div>
                    <div className="flex flex-col sm:flex-row items-stretch md:justify-end gap-3 w-full">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 sm:px-6 sm:py-3.5 text-center font-mono font-bold text-[17px] tracking-[0.15em] text-gray-900 shadow-sm">
                        SIHCP40
                      </div>
                      <button className="bg-black text-white rounded-xl px-6 py-3.5 font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 cursor-default">
                        <FiCopy size={16} /> Copy Link
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 md:gap-6 items-start relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg md:text-xl shrink-0 z-10 shadow-md">2</div>
              <div className="absolute left-5 md:left-6 top-10 md:top-12 bottom-[-40px] w-0.5 bg-gray-200"></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiCopy className="text-purple-500" /> Copy Your Referral Code
                </h4>
                <p className="text-gray-600 mb-4">Click the "Copy Link" button to save your unique code to your clipboard.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 md:gap-6 items-start relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg md:text-xl shrink-0 z-10 shadow-md">3</div>
              <div className="absolute left-5 md:left-6 top-10 md:top-12 bottom-[-40px] w-0.5 bg-gray-200"></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiShare2 className="text-pink-500" /> Share with Friends
                </h4>
                <p className="text-gray-600">Send this link to your friends via WhatsApp, Instagram, or email. They must use your link to sign up and pay.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 md:gap-6 items-start relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg md:text-xl shrink-0 z-10 shadow-md shadow-green-500/30">4</div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiGift className="text-green-500" /> Get Your Refund!
                </h4>
                <p className="text-gray-600 mb-4">Once <strong className="text-black">5 friends</strong> successfully purchase any plan (₹44, ₹74, or ₹114), our system will automatically initiate a 100% refund to your original payment method!</p>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 mt-4 max-w-xl">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <FiCheckCircle size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-green-900 text-lg">Refund Initiated</h5>
                    <p className="text-green-700 text-sm font-medium">5/5 Referrals Completed. ₹74 will be credited to your account within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundGuide;
