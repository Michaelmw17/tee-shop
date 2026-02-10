"use client";
import { useEffect, ReactNode } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  emoji?: string;
  children: ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  buttonText?: string;
}

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title = "Notice",
  emoji = "ℹ️",
  children,
  gradientFrom = "blue-600",
  gradientTo = "purple-600",
  buttonText = "Got it"
}: AlertModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative" style={{
          backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))`,
          ['--tw-gradient-from' as string]: `rgb(${gradientFrom === 'orange-400' ? '251 146 60' : gradientFrom === 'red-400' ? '248 113 113' : '37 99 235'})`,
          ['--tw-gradient-to' as string]: `rgb(${gradientTo === 'red-500' ? '239 68 68' : gradientTo === 'red-600' ? '220 38 38' : '147 51 234'})`
        }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-5xl mb-2">{emoji}</div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
            style={{
              backgroundColor: gradientFrom === 'orange-400' ? 'rgb(251 146 60)' : gradientFrom === 'red-400' ? 'rgb(248 113 113)' : 'rgb(37 99 235)'
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
