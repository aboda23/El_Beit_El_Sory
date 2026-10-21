import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import ToastContainer from '../../components/common/Toast';
import { Lock, User, KeyRound, ShieldAlert, ArrowLeft } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, isAdminAuthenticated } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = loginAdmin(username, password);
      setLoading(false);
      if (ok) {
        navigate(from, { replace: true });
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('campusbites123');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
      <ToastContainer />

      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Link */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Bites Store</span>
        </button>

        {/* Login Card */}
        <div className="bg-bg-card border border-border-dark rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black text-2xl shadow-lg shadow-accent/20 mb-3">
              🍔
            </div>
            <h1 className="text-2xl font-black text-text-primary font-display">
              Admin Portal
            </h1>
            <p className="text-xs text-text-secondary">
              Sign in to manage meals, prices, active offers and orders
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20 text-xs text-text-secondary space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-accent">Demo Access Credentials:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-extrabold text-black bg-accent px-2 py-0.5 rounded hover:bg-accent-hover transition-colors"
              >
                Auto-Fill
              </button>
            </div>
            <p className="font-mono text-[11px] text-text-primary">
              User: <span className="text-accent font-bold">admin</span> | Pass:{' '}
              <span className="text-accent font-bold">campusbites123</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 pl-10 focus:outline-none"
                />
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-bg-secondary border border-border-dark focus:border-accent text-text-primary text-xs rounded-xl p-3 pl-10 focus:outline-none"
                />
                <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={Lock}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Security Limitation Notice */}
          <div className="pt-2 border-t border-border-dark/60 text-center">
            <p className="text-[10px] text-text-muted flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-text-muted" />
              <span>Frontend-only prototype demo authentication.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
