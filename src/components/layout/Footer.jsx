import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MessageCircle, MapPin, Clock, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/orderFormatter';
import logoImg from '../../assets/logo.jpg';

export function Footer() {
  const { settings, categories, isRTL, lang } = useApp();

  const handleWhatsAppContact = (number = '201144590527') => {
    const restaurant = lang === 'ar' ? 'مطعم البيت السوري' : 'Al Beit Al Souri';
    const message = lang === 'ar' 
      ? `مرحباً ${restaurant}! أود الاستفسار عن المنيو وطلب وجبة.`
      : `Hello ${restaurant}! I have an inquiry about the menu and ordering.`;
    const url = buildWhatsAppUrl(number, message);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="w-full bg-bg-secondary border-t border-border-dark mt-16 text-text-secondary text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-card border-2 border-accent/40 shrink-0 shadow-md shadow-accent/20">
                <img
                  src={logoImg}
                  alt={settings?.restaurantName || 'مطعم البيت السوري'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display font-black text-lg text-text-primary tracking-tight block">
                  {lang === 'ar' ? (settings?.restaurantName || 'مطعم البيت السوري') : (settings?.restaurantNameEn || 'Al Beit Al Souri')}
                </span>
                <span className="text-[11px] text-accent font-semibold">
                  {isRTL ? 'أمام جامعة سيناء' : 'In front of Sinai University'}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isRTL
                ? 'أشهى الشاورما السوري والبروستد والوجبات السريعة لطلاب جامعة سيناء وأهالي القنطرة شرق بأعلى جودة وأفضل الأسعار.'
                : 'Authentic Syrian shawarma, crispy broasted chicken, and fast delivery for Sinai University students and El Qantara Sharq.'}
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleWhatsAppContact('201144590527')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-whatsapp/15 text-whatsapp border border-whatsapp/30 hover:bg-whatsapp/25 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب 1: 01144590527</span>
              </button>
              <button
                type="button"
                onClick={() => handleWhatsAppContact('201017753792')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-whatsapp/15 text-whatsapp border border-whatsapp/30 hover:bg-whatsapp/25 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب 2: 01017753792</span>
              </button>
            </div>
          </div>

          {/* Quick Menu Links */}
          <div>
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
              {isRTL ? 'أقسام المنيو' : 'Menu Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              {(categories || []).slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/menu?category=${cat.id}`}
                    className="hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/offers" className="text-accent hover:underline flex items-center gap-1.5 font-medium">
                  <span>✨</span>
                  <span>{isRTL ? 'عروض وتخفيضات الطلاب' : 'Student Deals & Offers'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Numbers & Location */}
          <div>
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
              {isRTL ? 'العنوان وأرقام الطلبات' : 'Branch & Contact'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="font-medium text-text-primary">
                  {settings?.branchAddress || 'مدينة القنطرة شرق - أمام جامعة سيناء'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>{settings?.openingHours || '10:00 ص – 2:00 ص يومياً'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-text-primary">
                    <a href="tel:01144590527" className="hover:text-accent hover:underline">01144590527</a>
                    <span>•</span>
                    <a href="tel:01017753792" className="hover:text-accent hover:underline">01017753792</a>
                  </div>
                  <span className="text-[10px] text-text-muted block">أرقام استقبال الطلبات</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-red-400 font-bold">
                    {isRTL ? 'رقم الشكاوى والمقترحات:' : 'Complaints & Suggestions:'}
                  </span>
                  <a href="tel:01098532247" className="font-extrabold hover:underline">01098532247</a>
                </div>
              </div>
            </div>
          </div>

          {/* Admin & Info */}
          <div>
            <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
              {isRTL ? 'لوحة تحكم الإدارة' : 'Management'}
            </h4>
            <p className="text-xs text-text-muted mb-3 leading-relaxed">
              {isRTL
                ? 'إدارة وجبات المنيو والأسعار وتحديث العروض وحالة توفر الوجبات مباشرة للعملاء.'
                : 'Staff and management can access menu pricing, stock availability, and timed promotions.'}
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-cardHover border border-border-dark text-text-primary hover:text-accent transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>{isRTL ? 'لوحة إدارة المطعم' : 'Admin Dashboard'}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-border-dark/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} مطعم البيت السوري. خدمة طلاب جامعة سيناء والقنطرة شرق.</p>
          <div className="flex items-center gap-2 text-center text-[11px] bg-bg-card/40 px-3 py-1.5 rounded-lg border border-border-dark/40">
            <span>⚡ تم تطوير الموقع للطلب المباشر والسريع عبر الواتساب.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
