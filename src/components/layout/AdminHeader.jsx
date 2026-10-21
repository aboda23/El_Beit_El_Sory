import React from 'react';
import { Menu, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function AdminHeader({ onOpenSidebar, title = 'Admin Dashboard' }) {
  const { lang, toggleLang, t } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-bg-primary/95 backdrop-blur-md border-b border-border-dark px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          aria-label="Open admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-xl font-extrabold text-text-primary font-display">
            {title}
          </h1>
          <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>{lang === 'ar' ? 'جلسة تجريبية نشطة' : 'Frontend Prototype Session'}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-bg-card hover:bg-bg-cardHover border border-border-dark text-text-primary transition-all"
          title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <Globe className="w-3.5 h-3.5 text-accent" />
          <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-cardHover border border-border-dark text-text-secondary hover:text-text-primary transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('viewStore', 'View Site')}</span>
        </Link>

        {/* Admin Avatar matching Mockup 7 */}
        <div className="flex items-center gap-2 bg-bg-card border border-border-dark py-1.5 px-2.5 rounded-2xl">
          <div className="w-7 h-7 rounded-xl bg-accent text-black font-extrabold text-xs flex items-center justify-center">
            A
          </div>
          <span className="text-xs font-bold text-text-primary hidden sm:inline-block">
            {lang === 'ar' ? 'المشرف' : 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
