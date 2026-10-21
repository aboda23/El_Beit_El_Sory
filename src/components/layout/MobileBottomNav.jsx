import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Home, UtensilsCrossed, Tag, ShoppingBag } from 'lucide-react';

export function MobileBottomNav() {
  const { cartSummary, t } = useApp();

  const navItems = [
    { to: '/', label: t('navHome', 'Home'), icon: Home, end: true },
    { to: '/menu', label: t('navMenu', 'Menu'), icon: UtensilsCrossed, end: false },
    { to: '/offers', label: t('navOffers', 'Offers'), icon: Tag, end: false },
    { to: '/cart', label: t('navCart', 'Cart'), icon: ShoppingBag, end: false, badge: cartSummary.totalItems },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-lg border-t border-border-dark px-3 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-accent font-bold scale-105'
                    : 'text-text-muted hover:text-text-secondary font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-150 ${
                        isActive ? 'text-accent stroke-[2.5]' : 'stroke-[1.8]'
                      }`}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-accent text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-bg-secondary">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] mt-1 ${isActive ? 'text-accent font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
