import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/admin/StatCard';
import OrdersChart from '../../components/admin/OrdersChart';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  ShoppingBag,
  TrendingUp,
  Tag,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
} from 'lucide-react';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { products, activeOffers, orders, settings, t, isRTL } = useApp();

  // Statistics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const outOfStockCount = products.filter((p) => !p.isAvailable).length;
  const inStockCount = products.filter((p) => p.isAvailable).length;

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
    }
    if (s.includes('ready') || s.includes('pickup')) {
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
    }
    if (s.includes('preparing') || s.includes('progress')) {
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
    }
    if (s.includes('cancel')) {
      return 'bg-red-500/15 text-red-400 border border-red-500/25';
    }
    return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-bg-card border border-border-dark shadow-card">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-text-primary font-display">
            {isRTL ? 'نظرة عامة على تشغيل المطعم' : 'Restaurant Operations Overview'}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {isRTL ? 'متابعة مباشرة لطلبات الطلاب وحالة المخزون وإحصائيات العروض' : 'Monitor real-time student ordering, stock status, and promo campaign analytics'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-accent hover:bg-accent-hover text-black transition-all shadow-md shadow-accent/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isRTL ? 'إضافة وجبة جديدة' : 'Add New Meal'}</span>
          </Link>
          <Link
            to="/admin/offers"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-bg-secondary hover:bg-bg-cardHover border border-border-dark text-text-primary transition-colors"
          >
            <Tag className="w-4 h-4 text-accent" />
            <span>{isRTL ? 'إنشاء عرض جديد' : 'Create Promo'}</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards matching Mockup 7 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('totalOrders')}
          value={totalOrdersCount}
          change="12%"
          isPositive={true}
          icon={ShoppingBag}
          subtitle={isRTL ? "من ذاكرة المتصفح" : "Demo browser history"}
        />
        <StatCard
          title={t('todayRevenue')}
          value={formatCurrency(totalRevenue, settings?.currency || 'EGP')}
          change="18%"
          isPositive={true}
          icon={TrendingUp}
          subtitle={isRTL ? "مبيعات محاكاة" : "Local orders simulated"}
        />
        <StatCard
          title={t('activeOffersCount')}
          value={activeOffers.length}
          icon={Tag}
          subtitle={isRTL ? "تخفيضات نشطة على المنيو" : "Currently discounting menu"}
        />
        <StatCard
          title={isRTL ? 'غير المتوفر' : 'Out of Stock'}
          value={outOfStockCount}
          isPositive={outOfStockCount === 0}
          icon={AlertTriangle}
          subtitle={isRTL ? `${inStockCount} وجبة متوفرة` : `${inStockCount} items available`}
        />
      </div>

      {/* Middle Section: Orders Chart & Quick Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-8 bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                {isRTL ? 'إحصائيات الطلبات' : 'Orders Overview'}
              </h3>
              <p className="text-xs text-text-muted">
                {isRTL ? 'معدل الطلبات الأسبوعية لطلاب الجامعة' : 'Weekly student ordering distribution'}
              </p>
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-xl border border-accent/20">
              {isRTL ? 'رسم بياني مباشر' : 'Live Chart'}
            </span>
          </div>

          <OrdersChart />
        </div>

        {/* Quick Menu Summary Column */}
        <div className="lg:col-span-4 bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">
              {isRTL ? 'حالة المنيو والمخزون' : 'Menu Health'}
            </h3>
            <p className="text-xs text-text-muted mb-4">
              {isRTL ? 'يمكنك تفعيل أو إيقاف توفر الوجبات مباشرة ليظهر التحديث فوراً للعملاء.' : 'Instant toggles allow modifying customer visibility instantly without page reloads.'}
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border-dark">
                <span className="text-text-secondary">{isRTL ? 'الوجبات المتاحة' : 'Available Meals'}</span>
                <span className="font-extrabold text-emerald-400">{inStockCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border-dark">
                <span className="text-text-secondary">{isRTL ? 'غير المتوفر' : 'Out of Stock'}</span>
                <span className="font-extrabold text-red-400">{outOfStockCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary border border-border-dark">
                <span className="text-text-secondary">{isRTL ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span className="font-extrabold text-accent">
                  {formatCurrency(settings?.deliveryFee || 15, settings?.currency || 'EGP')}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-colors"
          >
            <span>{isRTL ? 'إدارة قائمة الوجبات' : 'Manage Product Catalog'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section matching Mockup 7 */}
      <div className="bg-bg-card border border-border-dark rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border-dark/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {isRTL ? 'أحدث الطلبات' : 'Recent Orders'}
            </h3>
            <p className="text-xs text-text-muted">
              {isRTL ? 'آخر الطلبات الواردة عبر مسار إتمام الطلب والواتساب' : 'Latest submissions received via the WhatsApp ordering checkout flow'}
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>{t('seeAll')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-text-muted py-4 text-center">
            No orders placed yet. Place an order in the customer checkout to see it appear here!
          </p>
        ) : (
          <div className="space-y-2.5">
            {recentOrders.map((order) => {
              const firstItem = order.items && order.items[0];
              const remainingCount = (order.items?.length || 1) - 1;

              return (
                <div
                  key={order.id}
                  onClick={() => navigate('/admin/orders')}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg-secondary/60 hover:bg-bg-secondary border border-border-dark cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-card border border-border-dark overflow-hidden shrink-0">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">🍔</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-accent">
                          {order.orderReference || order.id}
                        </span>
                        <span className="font-bold text-text-primary">
                          {firstItem?.name || 'Order Meal'}
                          {remainingCount > 0 ? ` +${remainingCount} more` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>{order.customer?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-text-primary text-sm">
                      {formatCurrency(order.total, settings?.currency || 'EGP')}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
