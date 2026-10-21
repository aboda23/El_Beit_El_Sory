import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, UtensilsCrossed } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-24 h-24 rounded-3xl bg-bg-card border border-border-dark flex items-center justify-center text-5xl mb-6 shadow-2xl">
        🍔
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full mb-3">
        404 Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight font-display mb-3">
        Oops! Looks Like We Burnt This One
      </h1>

      <p className="text-sm text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for has been eaten or moved to a different kitchen counter. Let's get you back to the delicious food!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/')}
          icon={Home}
        >
          Return to Home
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/menu')}
          icon={UtensilsCrossed}
        >
          Browse Menu
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
