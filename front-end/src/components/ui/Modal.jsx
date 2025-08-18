import React from 'react';

const Modal = ({ open, onClose, children, zIndex = 10050, anchorRef }) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;
  return (
    <div style={{ zIndex, position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 min-w-[260px] max-w-[95vw] border border-blue-200 absolute"
        style={{ top: position.top, left: position.left, pointerEvents: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
