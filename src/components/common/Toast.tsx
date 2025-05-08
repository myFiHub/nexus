import React, { useEffect } from 'react';

/**
 * Toast notification types
 */
type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast component props
 */
export type ToastProps = {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms
  onClose?: () => void;
};

/**
 * Toast/Notification component for global feedback
 */
const Toast: React.FC<ToastProps> = ({ type, message, description, duration = 4000, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      <div className="toast-message">{message}</div>
      {description && <div className="toast-description">{description}</div>}
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close notification">
          ×
        </button>
      )}
    </div>
  );
};

export default Toast; 