import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiTrash2, FiFile, FiLock, FiPlus, FiArrowRight, FiArrowLeft, FiSearch } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import toast from 'react-hot-toast';

const SUBJECTS = [
  { code: '001', name: 'ENGLISH ELECTIVE-N', candidates: 1765 },
  { code: '002', name: 'HINDI ELECTIVE', candidates: 159052 },
  { code: '003', name: 'URDU ELECTIVE', candidates: 2215 },
  { code: '022', name: 'SANSKRIT ELECTIVE', candidates: 1674 },
  { code: '027', name: 'HISTORY', candidates: 158585 },
  { code: '028', name: 'POLITICAL SCIENCE', candidates: 174796 },
  { code: '029', name: 'GEOGRAPHY', candidates: 91239 },
  { code: '030', name: 'ECONOMICS', candidates: 383647 },
  { code: '031', name: 'CARNATIC MUSIC VOC', candidates: 44 },
  { code: '034', name: 'HIND.MUSIC VOCAL', candidates: 46543 },
  { code: '035', name: 'HIND.MUSIC MEL.INS', candidates: 2886 },
  { code: '036', name: 'HIND MUSIC.INS.PER', candidates: 962 },
  { code: '037', name: 'PSYCHOLOGY', candidates: 15415 },
  { code: '039', name: 'SOCIOLOGY', candidates: 37334 },
  { code: '040', name: 'PHILOSOPHY', candidates: 80 },
  { code: '041', name: 'MATHEMATICS', candidates: 502635 },
  { code: '042', name: 'PHYSICS', candidates: 556019 },
  { code: '043', name: 'CHEMISTRY', candidates: 554437 },
  { code: '044', name: 'BIOLOGY', candidates: 214415 },
  { code: '045', name: 'BIOTECHNOLOGY', candidates: 3228 },
  { code: '046', name: 'ENGG. GRAPHICS', candidates: 3490 },
  { code: '048', name: 'PHYSICAL EDUCATION', candidates: 616629 },
  { code: '049', name: 'PAINTING', candidates: 74560 },
  { code: '050', name: 'GRAPHICS', candidates: 558 },
  { code: '051', name: 'SCULPTURE', candidates: 849 },
  { code: '052', name: 'APP/COMMERCIAL ART', candidates: 8869 },
  { code: '053', name: 'FASHION STUDIES', candidates: 1615 },
  { code: '054', name: 'BUSINESS STUDIES', candidates: 305706 },
  { code: '055', name: 'ACCOUNTANCY', candidates: 304206 },
  { code: '056', name: 'DANCE-KATHAK', candidates: 1087 },
  { code: '057', name: 'DANCE-BHARATNATYAM', candidates: 163 },
  { code: '059', name: 'DANCE-ODISSI', candidates: 65 },
  { code: '061', name: 'DANCE-KATHAKALI', candidates: 2 },
  { code: '064', name: 'HOME SCIENCE', candidates: 60947 },
  { code: '065', name: 'INFORMATICS PRAC.', candidates: 69663 },
  { code: '066', name: 'ENTREPRENEURSHIP', candidates: 13235 },
  { code: '067', name: 'MULTIMEDIA & WEB T', candidates: 5735 },
  { code: '068', name: 'AGRICULTURE', candidates: 1629 },
  { code: '069', name: 'CR WRTNG TR STUDY', candidates: 122 },
  { code: '070', name: 'HERITAGE CRAFTS', candidates: 40 },
  { code: '071', name: 'GRAPHIC DESIGN', candidates: 62 },
  { code: '072', name: 'MASS MEDIA STUDIES', candidates: 1187 },
  { code: '073', name: 'KNOW TRAD & PRAC.', candidates: 63 },
  { code: '074', name: 'LEGAL STUDIES', candidates: 2148 },
  { code: '075', name: 'HUMAN RIGHTS & G S', candidates: 501 },
  { code: '076', name: 'NAT. CADET CORPS', candidates: 304 },
  { code: '078', name: 'THEATRE STUDIES', candidates: 254 },
  { code: '079', name: 'LIBRARY & INFO SC.', candidates: 214 },
  { code: '083', name: 'COMPUTER SCIENCE', candidates: 104971 },
  { code: '101', name: 'ENGLISH ELECTIVE-C', candidates: 9998 },
  { code: '104', name: 'PUNJABI', candidates: 13648 },
  { code: '105', name: 'BENGALI', candidates: 3876 },
  { code: '106', name: 'TAMIL', candidates: 677 },
  { code: '107', name: 'TELUGU', candidates: 600 },
  { code: '108', name: 'SINDHI', candidates: 5 },
  { code: '109', name: 'MARATHI', candidates: 317 },
  { code: '110', name: 'GUJARATI', candidates: 32 },
  { code: '111', name: 'MANIPURI', candidates: 421 },
  { code: '112', name: 'MALAYALAM', candidates: 3157 },
  { code: '113', name: 'ODIA', candidates: 415 },
  { code: '114', name: 'ASSAMESE', candidates: 7 },
  { code: '115', name: 'KANNADA', candidates: 554 },
  { code: '116', name: 'ARABIC', candidates: 376 },
  { code: '117', name: 'TIBETAN', candidates: 1184 },
  { code: '118', name: 'FRENCH', candidates: 125 },
  { code: '120', name: 'GERMAN', candidates: 52 },
  { code: '121', name: 'RUSSIAN', candidates: 1 },
  { code: '123', name: 'PERSIAN', candidates: 10 },
  { code: '124', name: 'NEPALI', candidates: 4346 },
  { code: '125', name: 'LIMBOO', candidates: 346 },
  { code: '126', name: 'LEPCHA', candidates: 442 },
  { code: '189', name: 'TELUGU - TELANGANA', candidates: 82 },
  { code: '193', name: 'TANGKHUL', candidates: 78 },
  { code: '194', name: 'JAPANESE', candidates: 14 },
  { code: '195', name: 'BHUTIA', candidates: 309 },
  { code: '196', name: 'SPANISH', candidates: 3 },
  { code: '198', name: 'MIZO', candidates: 111 },
  { code: '205', name: 'BENGALI W/O PR.', candidates: 11 },
  { code: '301', name: 'ENGLISH CORE', candidates: 1037082 },
  { code: '302', name: 'HINDI CORE', candidates: 166524 },
  { code: '303', name: 'URDU CORE', candidates: 1149 },
  { code: '322', name: 'SANSKRIT CORE', candidates: 19419 },
  { code: '604', name: 'OFFCE PROC.& PRAC.', candidates: 1191 },
  { code: '605', name: 'SECY.PRAC & ACCNTG', candidates: 98 },
  { code: '606', name: 'OFF. COMMUNICATION', candidates: 168 },
  { code: '607', name: 'TYPOGRAPHY &CA ENG', candidates: 3303 },
  { code: '608', name: 'SHORTHAND ENGLISH', candidates: 1881 },
  { code: '609', name: 'TYPOGRAPHY &CA HIN', candidates: 484 },
  { code: '610', name: 'SHORTHAND HINDI', candidates: 405 },
  { code: '622', name: 'ENGINEERING SCI.', candidates: 227 },
  { code: '625', name: 'APPLIED PHYSICS', candidates: 64 },
  { code: '626', name: 'MECH. ENGINEERING', candidates: 11 },
  { code: '627', name: 'AUTO ENGG. - II', candidates: 122 },
  { code: '628', name: 'AUTOSHOP RPR&PR-II', candidates: 122 },
  { code: '632', name: 'AC & REFRGTN-III', candidates: 120 },
  { code: '633', name: 'AC & REFRGTN-IV', candidates: 119 },
  { code: '657', name: 'BIO-OPTHALMIC - II', candidates: 19 },
  { code: '658', name: 'OPTICS-II', candidates: 19 },
  { code: '659', name: 'OPHTHALMIC TECH.', candidates: 19 },
  { code: '660', name: 'LAB MEDCN-II (MLT)', candidates: 25 },
  { code: '661', name: 'CLNCL BIOCHEM(MLT)', candidates: 25 },
  { code: '662', name: 'MICROBIOLOGY (MLT)', candidates: 23 },
  { code: '666', name: 'RADIATION PHYSICS', candidates: 13 },
  { code: '667', name: 'RADIOGRAPHY-I (GN)', candidates: 13 },
  { code: '668', name: 'RADIOGRAPHY-II(SP)', candidates: 13 },
  { code: '728', name: 'HLT ED,C & PR & PH', candidates: 14 },
  { code: '729', name: 'B CONCEPT OF HD&MT', candidates: 17 },
  { code: '730', name: 'FA & EMER MED CARE', candidates: 4 },
  { code: '731', name: 'CHILD HLTH NURSING', candidates: 14 },
  { code: '732', name: 'MIDWIFERY', candidates: 14 },
  { code: '733', name: 'HEALTH CENTRE MGMT', candidates: 14 },
  { code: '734', name: 'FOOD PROD-III', candidates: 612 },
  { code: '735', name: 'FOOD PRODUCTION-IV', candidates: 629 },
  { code: '736', name: 'FOOD SERVICES-II', candidates: 208 },
  { code: '737', name: 'FOOD BEV CST & CTR', candidates: 199 },
  { code: '738', name: 'EVOL&FORM OF MM-II', candidates: 248 },
  { code: '739', name: 'CR&CM PR IN MM-II', candidates: 248 },
  { code: '740', name: 'GEOSPATIAL TECH', candidates: 348 },
  { code: '741', name: 'LAB MEDICINE - II', candidates: 47 },
  { code: '742', name: 'CL BIOCHEM & MB-II', candidates: 47 },
  { code: '743', name: 'RETAIL OPER - II', candidates: 181 },
  { code: '744', name: 'RETAIL SERVICES-II', candidates: 91 },
  { code: '745', name: 'BEAUTY & HAIR - II', candidates: 1462 },
  { code: '746', name: 'HOLISTIC HEALTH-II', candidates: 1600 },
  { code: '747', name: 'LIB SYS & RES MGMT', candidates: 104 },
  { code: '748', name: 'INFO STORAGE & RET', candidates: 103 },
  { code: '749', name: 'INTGRTD TRANS OPRN', candidates: 16 },
  { code: '750', name: 'LOG OP & SCMGMT-II', candidates: 20 },
  { code: '751', name: 'BAKERY - II', candidates: 44 },
  { code: '752', name: 'CONFECTIONERY', candidates: 35 },
  { code: '753', name: 'FRONT OFFICE OPRNS', candidates: 55 },
  { code: '754', name: 'ADV FRONT OFF OPRN', candidates: 55 },
  { code: '756', name: 'INTRO TO HOSP MGMT', candidates: 956 },
  { code: '757', name: 'TR AGN & TOUR OP B', candidates: 786 },
  { code: '762', name: 'B HORTICULTURE -II', candidates: 180 },
  { code: '763', name: 'OLERICULTURE - II', candidates: 136 },
  { code: '765', name: 'FLORICULTURE', candidates: 180 },
  { code: '766', name: 'BUS.OP & ADMN - II', candidates: 77 },
  { code: '774', name: 'FABRIC STUDY', candidates: 475 },
  { code: '775', name: 'BASIC PATTERN DEV.', candidates: 1855 },
  { code: '776', name: 'GARMENT CONST.-II', candidates: 1926 },
  { code: '777', name: 'TRAD IND TEXTILE', candidates: 601 },
  { code: '778', name: 'PRINTED TEXTILE', candidates: 431 },
  { code: '779', name: 'TEXTILE CHEM PROC', candidates: 292 },
  { code: '780', name: 'FIN ACCOUNT - II', candidates: 37 },
  { code: '781', name: 'COST ACCOUNTING', candidates: 40 },
  { code: '782', name: 'TAXATION - II', candidates: 72 },
  { code: '783', name: 'MARKETING-II', candidates: 2494 },
  { code: '784', name: 'SALESMANSHIP-II', candidates: 159 },
  { code: '785', name: 'BANKING-II', candidates: 577 },
  { code: '786', name: 'INSURANCE-II', candidates: 320 },
  { code: '787', name: 'ELECTRICAL MACHINE', candidates: 173 },
  { code: '788', name: 'ELECTRICAL APPLIAN', candidates: 173 },
  { code: '789', name: 'OP & MNT OF COM DV', candidates: 104 },
  { code: '790', name: 'TR SHOOTING & MEE', candidates: 104 },
  { code: '793', name: 'CAPITAL MKT OPERNS', candidates: 662 },
  { code: '794', name: 'DERIVATIVE MKT OPR', candidates: 426 },
  { code: '795', name: 'DATABASE MGMT APP', candidates: 1377 },
  { code: '796', name: 'WEB APPLICATION-II', candidates: 1356 }
];

const SubjectSearchSelect = ({ value, onChange }) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const filtered = SUBJECTS.filter(sub =>
    sub.name.toLowerCase().includes(query.toLowerCase()) ||
    sub.code.includes(query)
  );

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          required
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 250);
          }}
          placeholder="Search by code or name..."
          className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 px-4 pr-10 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch size={16} />
        </div>
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 py-1">
          {filtered.slice(0, 50).map(sub => (
            <button
              key={sub.code}
              type="button"
              onMouseDown={() => {
                onChange(sub.name);
                setQuery(sub.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between text-[13px] transition-colors border-none bg-transparent"
            >
              <span className="font-semibold text-gray-900">{sub.name}</span>
              <span className="text-[11px] text-gray-400 font-medium ml-2 shrink-0">
                ({sub.code}) — {sub.candidates.toLocaleString()} candidates
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const calculatePrice = (count) => {
  const now = new Date();
  
  const flashSaleStart = new Date('2026-06-01T04:30:00Z'); // 10:00 AM IST
  const flashSaleEnd = new Date('2026-06-01T16:30:00Z'); // 10:00 PM IST
  
  // Flash sale active only on 1 June 2026 between 10 AM and 10 PM IST
  const isFlashSaleActive = now >= flashSaleStart && now < flashSaleEnd;

  if (isFlashSaleActive) {
    if (count === 1) return 44;
    if (count === 2) return 74;
    if (count >= 3) return 114;
  } else {
    if (count === 1) return 59;
    if (count === 2) return 99;
    if (count >= 3) return 149;
  }
  
  return 0;
};

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subjects: [{ subject: '', currentMarks: '', expectedMarks: '' }],
    reason: '',
    studentMobile: '',
  });

  const handleAddSubject = () => {
    setForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, { subject: '', currentMarks: '', expectedMarks: '' }]
    }));
  };

  const handleRemoveSubject = (index) => {
    if (form.subjects.length === 1) return;
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...form.subjects];
    if (field === 'currentMarks' || field === 'expectedMarks') {
      value = value === '' ? '' : Number(value);
    }
    newSubjects[index][field] = value;
    setForm(prev => ({ ...prev, subjects: newSubjects }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.reason.trim().length < 20) {
      return toast.error('Reason must be at least 20 characters');
    }

    if (!form.studentMobile || form.studentMobile.length < 10) {
      return toast.error('Please provide a valid mobile number');
    }

    const invalidSubject = form.subjects.find(s => !s.subject || s.currentMarks === '' || s.currentMarks < 0 || s.currentMarks > 100);
    if (invalidSubject) {
      return toast.error('Please fill all subject details correctly');
    }

    setLoading(true);
    
    try {
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // 1. Create order
      const { data } = await api.post('/applications', {
        subjects: form.subjects,
        reason: form.reason,
        studentMobile: form.studentMobile
      });

      const { razorpayOrder, application, razorpayKey } = data;

      // 2. Open Razorpay modal

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || razorpayKey, 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Veritasco Recheck',
        description: 'Application Fee',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify payment signature
            await api.post('/applications/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              applicationId: application._id
            });
            
            toast.success('Payment successful!');
            navigate(`/application/${application._id}`);
          } catch (error) {
            console.error('Payment verify error', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: '', 
          email: '',
          contact: form.studentMobile
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const amount = calculatePrice(form.subjects.length);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-3xl mx-auto navbar-padding pb-16 px-4 flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          
          <div className="mb-10">
            <Link to="/dashboard" className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 mb-4 no-underline">
              <FiArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">New Application</h1>
            <p className="text-[15px] text-gray-500 font-medium">Provide details for expert evaluation before applying for recheck.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Details */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h2>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
                <input 
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.studentMobile}
                  onChange={(e) => setForm(prev => ({ ...prev, studentMobile: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Subject Details */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Subject Details</h2>
                <button type="button" onClick={handleAddSubject} className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gray-50 text-[13px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <FiPlus size={14} /> Add Subject
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {form.subjects.map((sub, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="grid md:grid-cols-12 gap-4 items-end p-5 rounded-2xl border border-gray-100 bg-gray-50/30 relative"
                    >
                      <div className="md:col-span-5 relative">
                        <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Subject</label>
                        <SubjectSearchSelect 
                          value={sub.subject}
                          onChange={(val) => handleSubjectChange(index, 'subject', val)}
                        />
                      </div>
                      
                      <div className="md:col-span-3">
                        <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Current Marks</label>
                        <input 
                          type="number" min="0" max="100" required
                          value={sub.currentMarks}
                          onChange={(e) => handleSubjectChange(index, 'currentMarks', e.target.value)}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-gray-300" 
                          placeholder="0-100"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Expected</label>
                        <input 
                          type="number" min="0" max="100"
                          value={sub.expectedMarks}
                          onChange={(e) => handleSubjectChange(index, 'expectedMarks', e.target.value)}
                          className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl py-3 px-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-gray-300"
                          placeholder="Optional"
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSubject(index)}
                          disabled={form.subjects.length === 1}
                          className="p-3 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Reason for Recheck</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6 font-medium">
                Explain why you believe your marks should increase (e.g. "I answered question 4 correctly but got 0 marks", "Step marking missing for long answers").
              </p>
              <textarea 
                required
                minLength={20}
                rows={5}
                value={form.reason}
                onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                placeholder="Write your detailed reason here... (minimum 20 characters)"
              />
            </div>

            {/* Checkout Card */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[5px] bg-[#2563eb]" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                  <p className="text-[13px] font-semibold text-gray-500 mt-1">{form.subjects.length} subject(s) selected</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 font-outfit">₹{amount}</div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total Amount</div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white rounded-full py-4 text-[14px] font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] disabled:opacity-70"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : <FiLock size={16} />}
                {loading ? 'Processing...' : `Pay ₹${amount} & Submit`}
              </button>
              
              <p className="text-[12px] text-center text-gray-400 font-medium mt-4">
                You will be able to upload your answer sheets on the next page after secure payment.
                <br /><br />
                <span className="text-gray-500">
                  If you face any issues or if payment is deducted but not reflected, please email us at <a href="mailto:info@veritasco.tech" className="text-blue-600 font-bold hover:underline">info@veritasco.tech</a>
                </span>
              </p>
            </div>

          </form>

        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationForm;
