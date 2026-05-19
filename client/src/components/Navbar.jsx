import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiMessageSquare } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? isAdmin
      ? [
          { to: '/admin', label: 'Dashboard', icon: FiHome },
          { to: '/admin/applications', label: 'Applications', icon: FiFileText },
          { to: '/admin/users', label: 'Students', icon: FiUser },
        ]
      : [
          { to: '/dashboard', label: 'Dashboard', icon: FiHome },
          { to: '/apply', label: 'Apply', icon: FiFileText },
          { to: '/messages', label: 'Messages', icon: FiMessageSquare },
        ]
    : [
        { to: '/#features', label: 'Features' },
        { to: '/#how-it-works', label: 'How It Works' },
        { to: '/#pricing', label: 'Pricing' },
        { to: '/#faq', label: 'FAQ' },
      ];

  const isLanding = location.pathname === '/';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 flex justify-center w-full pointer-events-none">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full max-w-5xl pointer-events-auto transition-all duration-300 ${
          mobileOpen ? 'rounded-[28px]' : 'rounded-full'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.06)' : '0 2px 10px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/veritasco.png" alt="Veritasco Recheck" className="w-8 h-8 object-contain" />
            <div className="font-semibold text-sm leading-tight tracking-tight text-gray-900 hidden sm:block" style={{ fontFamily: 'Outfit' }}>
              Veritasco Recheck
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </a>
            )}
            {navLinks.map((link) => (
              link.to.startsWith('/#') && isLanding ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  title={link.label}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all text-[13px] font-semibold"
                  style={{
                    color: location.pathname === link.to ? '#111' : '#6b7280',
                    backgroundColor: location.pathname === link.to ? '#f3f4f6' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  {link.icon && <link.icon size={16} />}
                  <span>{link.label}</span>
                </Link>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-1.5 py-1.5 rounded-full transition-all hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold bg-black">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-10 w-52 rounded-2xl shadow-xl border bg-white overflow-hidden border-gray-100 z-50"
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="p-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        {/* Mobile-only nav links inside dropdown */}
                        <div className="md:hidden mb-1 border-b border-gray-50 pb-1">
                          {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-blue-50 text-gray-700 hover:text-blue-600 no-underline" onClick={() => setDropdownOpen(false)}>
                              {link.icon && <link.icon size={14} />} {link.label}
                            </Link>
                          ))}
                        </div>
                        
                        <Link to={isAdmin ? '/admin' : '/dashboard'} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-gray-50 text-gray-700 no-underline"
                          onClick={() => setDropdownOpen(false)}>
                          <FiHome size={14} /> Dashboard
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full flex items-center justify-start gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-50 text-red-600">
                          <FiLogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gray-800 transition-colors shadow-sm no-underline">
                Check My Chances
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-600"
            >
              {mobileOpen ? <FiX size={16} /> : <FiMenu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 overflow-hidden bg-white/95 rounded-b-[24px]"
            >
              <div className="py-4 flex flex-col gap-1 px-4">
                {isAuthenticated && (
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 mb-2 bg-gray-50/50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-black shrink-0">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                )}
                {!isAuthenticated && (
                  <Link to="/auth" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-black text-white mb-2 no-underline">
                    Check My Chances
                  </Link>
                )}
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 no-underline hover:bg-gray-50">
                    {link.icon && <link.icon size={16} />}
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-medium text-red-600 hover:bg-red-50 mt-2">
                    <FiLogOut size={16} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
