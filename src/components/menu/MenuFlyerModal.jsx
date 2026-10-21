import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';

export function MenuFlyerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  const flyers = [
    { title: 'الوجه الأول: كريبات، وجبات غربي، مشويات، برجر', src: '/menu-flyer-1.jpg' },
    { title: 'الوجه الثاني: شاورما، ماريا، سندوتشات، خدمة التوصيل', src: '/menu-flyer-2.jpg' },
  ];

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-bg-card border border-border-dark rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-dark bg-bg-secondary">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text-primary">
              📜 المنيو الأصلي لمطعم البيت السوري
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-bg-card border border-border-dark rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab(0)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 0
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                الوجه 1 (مشويات وكريبات)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 1
                    ? 'bg-accent text-black shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                الوجه 2 (شاورما وسندوتشات)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative flex-1 overflow-auto bg-black/60 p-2 sm:p-4 flex items-center justify-center min-h-[400px]">
          <img
            src={flyers[activeTab].src}
            alt={flyers[activeTab].title}
            className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg border border-border-dark"
          />

          {/* Prev/Next arrows on sides */}
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === 0 ? 1 : 0))}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-border-dark transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === 0 ? 1 : 0))}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-border-dark transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-dark bg-bg-secondary flex items-center justify-between text-xs text-text-muted">
          <span>{flyers[activeTab].title}</span>
          <a
            href={flyers[activeTab].src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent hover:underline font-semibold"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>عرض بالحجم الكامل</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MenuFlyerModal;
