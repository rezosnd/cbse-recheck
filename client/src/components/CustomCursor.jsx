import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const arrowRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Check if hovering link/button
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hoverable = el && (
        el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')
      );
      isHovering.current = !!hoverable;
    };

    const animate = () => {
      // Spring lerp for ring
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) scale(${isHovering.current ? 1.5 : 1})`;
        ringRef.current.style.opacity = isHovering.current ? '0.6' : '0.9';
        ringRef.current.style.borderColor = isHovering.current ? '#60a5fa' : '#DDDBD6';
      }
      if (arrowRef.current) {
        arrowRef.current.style.opacity = isHovering.current ? '1' : '0';
      }

      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          borderRadius: '50%',
          border: '1.5px solid #DDDBD6',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'border-color 0.3s, opacity 0.3s, transform 0.08s',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      {/* Dot — instant */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      {/* Arrow icon — shows on hover */}
      <div
        ref={arrowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 100001,
          opacity: 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
          transform: ring.current
            ? `translate(${ring.current.x}px, ${ring.current.y}px)`
            : 'translate(-100px, -100px)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
