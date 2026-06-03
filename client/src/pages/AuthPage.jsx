import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FiHash, FiArrowRight, FiArrowLeft, FiCheckCircle, FiUser, FiAlertTriangle } from 'react-icons/fi';

// Keep in sync with App.jsx
const MAINTENANCE_MODE = false;

const STREAMS = ['Science', 'Commerce', 'Arts', 'Other'];

const ThankYouView = () => {
  const renderPeony = (x, y, color1, color2, color3, delay) => (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        initial={{ scale: 0, rotate: -60, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 10, delay: delay }}
      >
        <motion.g animate={{ scale: [1, 1.04, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay }}>
          {/* Back petals */}
          <path d="M0,0 Q-45,-55 0,-70 Q45,-55 0,0" fill={color1} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q-70,-25 -80,15 Q-45,45 0,0" fill={color1} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q70,-25 80,15 Q45,45 0,0" fill={color1} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q-40,65 0,75 Q40,65 0,0" fill={color1} stroke="#1f1d24" strokeWidth="2.5" />

          {/* Mid petals */}
          <path d="M0,0 Q-30,-45 0,-55 Q30,-45 0,0" fill={color2} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q-55,-15 -65,25 Q-30,50 0,0" fill={color2} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q55,-15 65,25 Q30,50 0,0" fill={color2} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q-25,50 0,60 Q25,50 0,0" fill={color2} stroke="#1f1d24" strokeWidth="2.5" />

          {/* Front petals */}
          <path d="M0,0 Q-20,-30 0,-40 Q20,-30 0,0" fill={color3} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q-40,-5 -45,20 Q-20,35 0,0" fill={color3} stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q40,-5 45,20 Q20,35 0,0" fill={color3} stroke="#1f1d24" strokeWidth="2.5" />

          {/* Center */}
          <circle cx="0" cy="0" r="16" fill="#FFD700" stroke="#1f1d24" strokeWidth="2.5" />
          <circle cx="-5" cy="-5" r="4" fill="#FFF" opacity="0.8" />
          <circle cx="6" cy="4" r="2" fill="#FFF" opacity="0.8" />
          <circle cx="-2" cy="7" r="2.5" fill="#FFF" opacity="0.8" />
        </motion.g>
      </motion.g>
    </g>
  );

  const renderLeaf = (x, y, rotation, delay) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: delay }}
      >
        <motion.g animate={{ rotate: [0, 8, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay }}>
          <path d="M0,0 Q35,-35 70,0 Q35,35 0,0" fill="#00FA9A" stroke="#1f1d24" strokeWidth="2.5" />
          <path d="M0,0 Q35,10 65,0" fill="none" stroke="#1f1d24" strokeWidth="2.5" />
        </motion.g>
      </motion.g>
    </g>
  );

  const renderSparkle = (x, y, delay) => (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], rotate: [0, 180] }} transition={{ duration: 3, repeat: Infinity, delay: delay, ease: "easeInOut" }}>
        <path d="M0,-15 Q0,0 15,0 Q0,0 0,15 Q0,0 -15,0 Q0,0 0,-15" fill="#FFD700" />
      </motion.g>
    </g>
  );

  const renderFloatingPetal = (x, y, color, delay, duration) => (
    <motion.path
      d="M0,0 Q10,-10 20,0 Q10,10 0,0"
      fill={color}
      stroke="#1f1d24"
      strokeWidth="1.5"
      initial={{ x: x, y: y, opacity: 0, rotate: 0 }}
      animate={{ x: x + 100, y: y - 100, opacity: [0, 1, 0], rotate: 180 }}
      transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "linear" }}
    />
  );

  return (
    <div className="h-[100dvh] bg-[#FDFDFD] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-inter text-gray-900 w-full"
      style={{
        // Subtle sketch paper texture
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
        .pencil-text {
          font-family: 'Kalam', cursive;
        }
      `}</style>

      {/* Background Decor - Top Left */}
      <div className="absolute top-[-80px] left-[-50px] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] pointer-events-none z-0 opacity-[0.35]">
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <defs>
            <filter id="pencilTextureBg">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#pencilTextureBg)">
            <motion.path d="M 0 0 Q 150 50 200 250" fill="transparent" stroke="#2E8B57" strokeWidth="5" />
            {renderLeaf(100, 80, 45, 1)}
            {renderLeaf(150, 180, -30, 1.3)}
            {renderPeony(80, 80, "#4B0082", "#8A2BE2", "#DDA0DD", 2)}
            {renderPeony(180, 200, "#FF4500", "#FF6347", "#FFA07A", 2.5)}
          </g>
        </svg>
      </div>

      {/* Background Decor - Top Right */}
      <div className="absolute top-[-50px] right-[-80px] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] pointer-events-none z-0 opacity-[0.35]">
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <g filter="url(#pencilTextureBg)">
            <motion.path d="M 400 0 Q 250 100 150 250" fill="transparent" stroke="#2E8B57" strokeWidth="5" />
            {renderLeaf(300, 100, -45, 1.2)}
            {renderLeaf(200, 180, 15, 1.5)}
            {renderPeony(320, 100, "#C71585", "#FF1493", "#FF69B4", 2.2)}
            {renderPeony(200, 220, "#FF4500", "#FF8C00", "#FFA500", 2.7)}
          </g>
        </svg>
      </div>

      {/* Background Decor - Bottom Left */}
      <div className="absolute bottom-[-80px] left-[-60px] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] pointer-events-none z-0 opacity-[0.35]">
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <g filter="url(#pencilTextureBg)">
            <motion.path d="M 0 400 Q 150 250 250 150" fill="transparent" stroke="#2E8B57" strokeWidth="5" />
            {renderLeaf(100, 320, 135, 1.4)}
            {renderLeaf(180, 220, 45, 1.7)}
            {renderPeony(100, 320, "#008B8B", "#00CED1", "#48D1CC", 2.4)}
            {renderPeony(220, 180, "#B8860B", "#FFD700", "#F0E68C", 2.9)}
          </g>
        </svg>
      </div>

      {/* Background Decor - Bottom Right */}
      <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] pointer-events-none z-0 opacity-[0.35]">
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <g filter="url(#pencilTextureBg)">
            <motion.path d="M 400 400 Q 250 300 150 150" fill="transparent" stroke="#2E8B57" strokeWidth="5" />
            {renderLeaf(300, 320, -135, 1.6)}
            {renderLeaf(220, 220, -45, 1.9)}
            {renderPeony(320, 320, "#556B2F", "#9ACD32", "#ADFF2F", 2.6)}
            {renderPeony(180, 180, "#8B0000", "#DC143C", "#FF4041", 3.1)}
          </g>
        </svg>
      </div>

      {/* Top Logo - Clean Original Look */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 no-underline group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img src="/veritasco.png" alt="Veritasco" className="w-5 h-5 sm:w-7 sm:h-7 object-contain" />
          </div>
          <span className="font-bold text-gray-900 text-[13px] sm:text-[15px] font-outfit hidden sm:block tracking-wide">Veritasco Recheck</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-[900px] z-10 flex flex-col items-center justify-center text-center h-full max-h-[100dvh]"
      >
        {/* SVG Drawing Animation for "THANK YOU" + Vines & Peonies */}
        <div className="relative w-full max-w-[750px] aspect-[2.2/1] sm:aspect-[2.5/1] md:aspect-[3/1] max-h-[45vh] mb-2 sm:mb-4 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
            <defs>
              <filter id="pencilTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            <g>
              {/* Vines drawn behind text */}
              <motion.path
                d="M 50 160 Q 200 10 350 200 T 550 80 T 750 180"
                fill="transparent"
                stroke="#2E8B57"
                strokeWidth="5"
                filter="url(#pencilTexture)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M 100 280 Q 250 150 400 320 T 600 200 T 780 300"
                fill="transparent"
                stroke="#3CB371"
                strokeWidth="4"
                filter="url(#pencilTexture)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, ease: "easeInOut", delay: 1 }}
              />

              {/* Leaves on Vines */}
              {renderLeaf(120, 110, -45, 1.5)}
              {renderLeaf(280, 150, 15, 1.7)}
              {renderLeaf(480, 100, -25, 2.0)}
              {renderLeaf(650, 150, 45, 2.3)}

              {renderLeaf(180, 240, 135, 1.8)}
              {renderLeaf(320, 270, 45, 2.1)}
              {renderLeaf(550, 250, -45, 2.4)}
              {renderLeaf(700, 280, 120, 2.7)}

              {/* Additional New Leaves for Lushness */}
              {renderLeaf(60, 180, -90, 1.6)}
              {renderLeaf(220, 80, -15, 1.9)}
              {renderLeaf(380, 180, 90, 2.2)}
              {renderLeaf(600, 70, 30, 2.5)}
              {renderLeaf(140, 300, 160, 2.0)}
              {renderLeaf(400, 320, -135, 2.3)}
              {renderLeaf(620, 310, -90, 2.6)}
              {renderLeaf(750, 200, 75, 2.8)}

              {/* 1. THANK YOU Text - Pencil Stroke Animation */}
              <motion.text
                x="50%" y="35%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-outfit font-black text-[130px] md:text-[150px] tracking-widest"
                fill="transparent"
                stroke="#111"
                strokeWidth="3.5"
                strokeDasharray="1500"
                filter="url(#pencilTexture)"
                initial={{ strokeDashoffset: 1500, fill: "transparent" }}
                animate={{ strokeDashoffset: 0, fill: "#1f1d24" }}
                transition={{
                  strokeDashoffset: { duration: 3.5, ease: "easeInOut" },
                  fill: { delay: 2.5, duration: 1.5, ease: "easeIn" }
                }}
              >
                THANK
              </motion.text>
              <motion.text
                x="50%" y="75%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-outfit font-black text-[130px] md:text-[150px] tracking-widest"
                fill="transparent"
                stroke="#111"
                strokeWidth="3.5"
                strokeDasharray="1500"
                filter="url(#pencilTexture)"
                initial={{ strokeDashoffset: 1500, fill: "transparent" }}
                animate={{ strokeDashoffset: 0, fill: "#1f1d24" }}
                transition={{
                  strokeDashoffset: { duration: 3.5, ease: "easeInOut", delay: 0.5 },
                  fill: { delay: 3, duration: 1.5, ease: "easeIn" }
                }}
              >
                YOU
              </motion.text>

              {/* 3. Extremely Colorful Hand-drawn Peonies Overlapping the text */}
              {/* Pink/Magenta Peony */}
              {renderPeony(170, 120, "#C71585", "#FF1493", "#FF69B4", 2.2)}

              {/* Blue/Cyan Peony */}
              {renderPeony(640, 125, "#008B8B", "#00CED1", "#48D1CC", 2.5)}

              {/* Orange/Gold Peony */}
              {renderPeony(260, 280, "#FF4500", "#FF8C00", "#FFA500", 2.8)}

              {/* Purple/Lilac Peony */}
              {renderPeony(580, 290, "#8B008B", "#9400D3", "#DA70D6", 3.1)}

              {/* Crimson Red Peony */}
              {renderPeony(420, 80, "#8B0000", "#DC143C", "#FF4041", 3.4)}

              {/* Golden Yellow Peony */}
              {renderPeony(420, 310, "#B8860B", "#FFD700", "#F0E68C", 3.7)}

              {/* 4. NEW Extra Lush Peonies */}
              {/* Emerald/Mint Peony */}
              {renderPeony(80, 220, "#006400", "#3CB371", "#98FB98", 2.9)}

              {/* Violet/Rose Peony */}
              {renderPeony(720, 210, "#4B0082", "#8A2BE2", "#DDA0DD", 3.3)}

              {/* Bright Coral/Peach Peony */}
              {renderPeony(340, 160, "#FF4500", "#FF6347", "#FFA07A", 3.0)}

              {/* Lime/Yellow Peony */}
              {renderPeony(490, 210, "#556B2F", "#9ACD32", "#ADFF2F", 3.5)}

              {/* Magical Twinkling Sparkles */}
              {renderSparkle(150, 80, 0)}
              {renderSparkle(650, 70, 1)}
              {renderSparkle(400, 250, 2)}
              {renderSparkle(200, 300, 0.5)}
              {renderSparkle(700, 250, 1.5)}
              {renderSparkle(300, 50, 0.8)}
              {renderSparkle(500, 330, 2.5)}
              {renderSparkle(90, 140, 1.2)}
              {renderSparkle(730, 110, 0.7)}

              {/* Animated Floating Petals */}
              {renderFloatingPetal(100, 350, "#FF69B4", 3, 8)}
              {renderFloatingPetal(700, 380, "#48D1CC", 4, 7)}
              {renderFloatingPetal(400, 400, "#FFA500", 5, 9)}
              {renderFloatingPetal(300, 100, "#DA70D6", 6, 8)}
              {renderFloatingPetal(550, 50, "#FF4041", 4.5, 8.5)}
              {renderFloatingPetal(200, 150, "#ADFF2F", 3.5, 7.5)}
            </g>
          </svg>
        </div>

        <motion.p
          className="text-lg sm:text-2xl md:text-3xl text-gray-800 font-bold leading-snug sm:leading-relaxed mb-4 sm:mb-8 max-w-[650px] pencil-text shrink-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 4 } }
          }}
        >
          {Array.from("Thank you for choosing us. We will come back next year with more surprises waiting!").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-10 mt-1 shrink-0">
          {/* Hand-drawn Copies Checked Stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ delay: 5.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative inline-flex items-center justify-center px-4 py-1.5 sm:px-6 sm:py-2.5 bg-yellow-100 border-[2.5px] border-gray-900"
            style={{
              borderRadius: "15px 255px 15px 225px/225px 15px 255px 15px",
              boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
              filter: "url(#pencilTexture)"
            }}
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-900 font-black pencil-text tracking-wide m-0 leading-none">
              More than 560+ copies re-evaluated!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5.5, duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-1.5 sm:gap-2"
          >
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-bold pencil-text tracking-wider uppercase border-b-2 border-gray-900 pb-0" style={{ filter: "url(#pencilTexture)", lineHeight: 1 }}>
              Design by Rezsond
            </p>
            <a
              href="https://www.instagram.com/r_e_z_o_s_nd"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 text-gray-900 hover:text-pink-600 transition-colors bg-white px-3 py-1.5 sm:px-5 sm:py-2 border-[2px] border-gray-900 pencil-text font-bold text-base sm:text-xl md:text-2xl leading-none"
              style={{
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.15)",
                filter: "url(#pencilTexture)"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Follow on Instagram
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Google Login, 2 = Complete Profile
  const [googleData, setGoogleData] = useState(null); // stores { credential, email, name }
  const [form, setForm] = useState({ rollNo: '', stream: 'Science' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const isAdminMode = searchParams.get('admin') === 'true';

  if (!isAdminMode) {
    return <ThankYouView />;
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // First try to log in
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
        clientId: credentialResponse.clientId,
        refCode
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
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(MAINTENANCE_MODE ? '/' : '/dashboard');
        }
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
        stream: form.stream,
        refCode
      };

      const res = await api.post('/auth/google-register', payload);

      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(MAINTENANCE_MODE ? '/' : '/dashboard');
      }
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
              {step === 1 ? 'Welcome Admin' : 'Complete Profile'}
            </h2>
            <p className="text-[14px] text-gray-500 font-medium">
              {step === 1 ? 'Sign in securely with your Google account' : `Hi ${googleData?.name?.split(' ')[0] || ''}, almost done!`}
            </p>
          </div>

          {/* Maintenance banner — visible to non-admins */}
          {MAINTENANCE_MODE && (
            <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <FiAlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[13px] text-amber-800 font-medium leading-snug">
                <strong>Site is temporarily closed.</strong> New applications reopen at <strong>12:00 AM</strong>. Admin login only.
              </p>
            </div>
          )}

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

