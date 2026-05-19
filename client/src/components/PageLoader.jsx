import { motion } from 'framer-motion';

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{ background: 'var(--color-bg)' }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative inline-flex">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-blue-200"
          style={{ borderTopColor: '#1e40af' }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-sm font-medium"
        style={{ color: 'var(--color-muted)' }}
      >
        Loading CBSE Recheck Advisor...
      </motion.p>
    </motion.div>
  </div>
);

export default PageLoader;
