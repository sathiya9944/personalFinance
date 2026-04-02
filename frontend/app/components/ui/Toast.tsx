'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global event bus for toasts
export const showToast = (message: string, type: ToastType = 'info') => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('app-toast', { detail: { message, type } });
    window.dispatchEvent(event);
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { message, type } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000); // 5 seconds
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transform transition-all duration-300 translate-y-0 opacity-100 ${
            toast.type === 'warning'
              ? 'bg-orange-50 border-orange-200 text-orange-800'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />}
          
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
