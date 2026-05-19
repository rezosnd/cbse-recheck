const StatusBadge = ({ status, size = 'md' }) => {
  const config = {
    submitted: { label: 'Submitted', cls: 'badge-submitted', dot: '#1e40af' },
    payment_verified: { label: 'Payment Verified', cls: 'badge-payment_verified', dot: '#15803d' },
    under_review: { label: 'Under Review', cls: 'badge-under_review', dot: '#b45309' },
    recommendation_ready: { label: 'Recommendation Ready', cls: 'badge-recommendation_ready', dot: '#7c3aed' },
    completed: { label: 'Completed', cls: 'badge-completed', dot: '#065f46' },
    rejected: { label: 'Rejected', cls: 'badge-rejected', dot: '#991b1b' },
    pending: { label: 'Pending', cls: 'badge-pending', dot: '#475569' },
    paid: { label: 'Paid', cls: 'badge-paid', dot: '#15803d' },
    failed: { label: 'Failed', cls: 'badge-rejected', dot: '#991b1b' },
    created: { label: 'Created', cls: 'badge-pending', dot: '#475569' },
  };

  const { label, cls, dot } = config[status] || config.pending;

  return (
    <span className={`badge ${cls}`} style={{ fontSize: size === 'sm' ? '11px' : '12px' }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dot }} />
      {label}
    </span>
  );
};

export default StatusBadge;
