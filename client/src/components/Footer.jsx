import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full text-center text-xs font-semibold text-gray-400 font-inter mt-auto bg-transparent">
      {/* Yellow Disclaimer Banner */}
      <div 
        style={{ 
          backgroundColor: '#fef9c3', 
          borderTop: '1px solid #fde047', 
          borderBottom: '1px solid #fde047', 
          color: '#713f12' 
        }}
        className="w-full py-3.5 mb-6 text-[12.5px] font-bold px-4 tracking-wide shadow-sm"
      >
        <div className="container-max max-w-6xl mx-auto flex items-center justify-center gap-2.5">
          {/* Vector Sketched Warning SVG Icon */}
          <svg className="w-4.5 h-4.5 shrink-0" style={{ color: '#ca8a04' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="leading-snug">
            <span style={{ color: '#451a03', fontWeight: 900 }} className="uppercase tracking-wider mr-1.5">Disclaimer:</span>
            This platform is not affiliated with CBSE. Educational guidance platform only.
          </span>
        </div>
      </div>

      <div className="container-max max-w-6xl mx-auto px-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Veritasco. All rights reserved.
        </div>
        <div className="flex items-center gap-1.5">
          <span>Designed by</span>
          <a
            href="https://www.instagram.com/r_e_z_o_s_nd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors font-bold underline decoration-wavy decoration-blue-500/30"
          >
            rezosnd
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
