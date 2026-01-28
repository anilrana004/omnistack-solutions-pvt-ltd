'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'lg',
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for accessibility
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={[
          'relative w-full',
          maxWidthClasses[maxWidth],
          'omni-glass',
          'max-h-[90vh] overflow-hidden',
          'transition-all duration-200',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          className,
        ].join(' ')}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 z-10 bg-white/10 backdrop-blur flex items-center justify-between gap-4 px-6 py-4 border-b border-white/15">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-50">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 text-white/70 hover:text-white transition-colors rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh] scroll-smooth">
          {children}
        </div>
      </div>
    </div>
  );
}

// Specialized modal components
export function ServiceModal({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    fullDescription: string;
    processSteps: string[];
    tools: string[];
    deliverables: string[];
    ctaText: string;
  } | null;
}) {
  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service.title}
      maxWidth="2xl"
    >
      <div className="px-6 py-6 space-y-6">
        {/* Description */}
        <div>
          <p className="text-white/85 leading-relaxed">
            {service.fullDescription}
          </p>
        </div>

        {/* Process Steps */}
        <div>
          <h3 className="text-lg font-semibold text-gray-50 mb-3">
            How We Work
          </h3>
          <ol className="space-y-2">
            {service.processSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-olive-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-white/85">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tools */}
        {service.tools.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-50 mb-3">
              Tools & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-white/10 text-white/85 border border-white/15 rounded-lg"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables */}
        <div>
          <h3 className="text-lg font-semibold text-gray-50 mb-3">
            What You Get
          </h3>
          <ul className="space-y-2">
            {service.deliverables.map((deliverable, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2" />
                <span className="text-white/85">{deliverable}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 z-10 px-6 py-4 bg-white/10 backdrop-blur border-t border-white/15 -mx-6 -mb-6">
          <button
            onClick={onClose}
            className="w-full bg-olive-600 hover:bg-olive-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {service.ctaText}
          </button>
        </div>
      </div>
    </Modal>
  );
}