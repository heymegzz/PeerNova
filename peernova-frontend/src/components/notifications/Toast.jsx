import { useEffect } from 'react';

function Toast({ id, type = 'info', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose?.(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500 text-emerald-100',
    error: 'bg-red-500/10 border-red-500 text-red-100',
    info: 'bg-blue-500/10 border-blue-500 text-blue-100',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-100',
  };

  return (
    <div className={`w-full max-w-xs rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${colors[type] || colors.info}`}>
      <div className="flex items-start gap-2">
        <div className="text-sm flex-1">{message}</div>
        <button
          type="button"
          onClick={() => onClose?.(id)}
          className="ml-2 text-xs opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, dismissToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[60]">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={dismissToast} />
      ))}
    </div>
  );
}

export default Toast;


