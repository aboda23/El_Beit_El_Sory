import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SearchBar from '../../components/menu/SearchBar';
import { formatCurrency } from '../../utils/formatCurrency';
import { Eye, Trash2, Clock, Bike, ShoppingBag, ShieldAlert } from 'lucide-react';

export function AdminOrdersPage() {
  const { orders, deleteOrder, updateOrderStatus, settings, t, isRTL } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const statuses = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = o.id?.toLowerCase().includes(q) || o.orderReference?.toLowerCase().includes(q);
        const matchCustomer = o.customer?.name?.toLowerCase().includes(q) || o.customer?.phone?.includes(q);
        return matchId || matchCustomer;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25';
    }
    if (s.includes('ready') || s.includes('pickup')) {
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/25';
    }
    if (s.includes('preparing')) {
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
    }
    if (s.includes('cancel')) {
      return 'bg-red-500/15 text-red-400 border border-red-500/25';
    }
    return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
  };

  const confirmDelete = () => {
    if (deletingOrderId) {
      deleteOrder(deletingOrderId);
      setDeletingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-black text-text-primary font-display">
          {isRTL ? 'إدارة الطلبات المحلية' : 'Local Orders Manager'} ({orders.length})
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          {isRTL ? 'مراجعة وتحديث حالات الطلبات المحفوظة محلياً عبر مسار الواتساب' : 'Review orders submitted via customer checkout, manage preparation status, and track totals'}
        </p>
      </div>

      {/* Prominent Demo Limitation Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-accent block mb-0.5">
            {isRTL ? 'تنبيه حفظ البيانات محلياً:' : 'Frontend Prototype Data Notice:'}
          </strong>
          <span>
            {isRTL
              ? 'نظراً لأن المشروع فرونت إند بالكامل، يتم حفظ الطلبات محلياً في ذاكرة المتصفح (localStorage) على هذا الجهاز، ويتم إرسال تفاصيل الطلب للمطعم عبر رابط محادثة واتساب المباشر.'
              : "Because this application runs client-side only without a backend database, orders are stored locally in your current browser's localStorage. Orders sent through WhatsApp require the customer to press Send on WhatsApp, and order synchronization between separate customer/admin devices would require a backend server."}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-bg-card border border-border-dark rounded-2xl p-4 shadow-card grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={isRTL ? 'بحث برقم الطلب (CB-...)، اسم العميل أو الهاتف...' : 'Search by Order ID (CB-...), customer name or phone...'}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-bg-secondary border border-border-dark text-text-primary text-xs rounded-xl p-2.5 focus:outline-none focus:border-accent"
          >
            <option value="all">{isRTL ? 'جميع الحالات' : 'All Statuses'}</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-bg-card border border-border-dark rounded-3xl overflow-hidden shadow-card">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            {isRTL ? 'لا توجد طلبات تطابق الفلتر المحدد.' : 'No orders found matching the filter criteria.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-dark bg-bg-secondary/60 text-text-muted font-bold uppercase tracking-wider">
                  <th className="p-4">{isRTL ? 'رقم الطلب' : 'Order ID'}</th>
                  <th className="p-4">{isRTL ? 'العميل' : 'Customer'}</th>
                  <th className="p-4">{isRTL ? 'الوجبات' : 'Items'}</th>
                  <th className="p-4">{isRTL ? 'طريقة الاستلام' : 'Method'}</th>
                  <th className="p-4">{isRTL ? 'الإجمالي' : 'Total'}</th>
                  <th className="p-4">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="p-4 text-right rtl:text-left">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/60">
                {filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-bg-cardHover/60 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-extrabold text-accent text-sm">
                          {order.orderReference || order.id}
                        </span>
                        <span className="block text-[11px] text-text-muted mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-text-primary text-sm block">
                          {order.customer?.name}
                        </span>
                        <span className="text-text-muted text-[11px]">
                          {order.customer?.phone}
                        </span>
                      </td>

                      <td className="p-4 text-text-secondary">
                        <span className="font-bold text-text-primary block">
                          {order.items?.length || 0} item(s)
                        </span>
                        <span className="text-[11px] text-text-muted line-clamp-1 max-w-[180px]">
                          {order.items?.map((i) => i.name).join(', ')}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-text-secondary">
                          {order.fulfillmentMethod === 'delivery' ? (
                            <>
                              <Bike className="w-3.5 h-3.5 text-accent" />
                              <span>{isRTL ? 'توصيل' : 'Delivery'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                              <span>{isRTL ? 'استلام من الفرع' : 'Pickup'}</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-text-primary text-sm">
                          {formatCurrency(order.total, settings?.currency || 'EGP')}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border bg-bg-secondary appearance-none cursor-pointer focus:outline-none ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s} className="bg-bg-card text-text-primary">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                            aria-label="View order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingOrderId(order.id)}
                            className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingOrderId}
        onClose={() => setDeletingOrderId(null)}
        onConfirm={confirmDelete}
        title={isRTL ? 'حذف الطلب من السجل؟' : 'Delete order from history?'}
        message={isRTL ? 'سيؤدي هذا إلى حذف بيانات الطلب من سجل المتصفح المحلي.' : 'This will remove this order entry from your local browser records.'}
        confirmText={isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
        cancelText={t('cancel')}
        type="danger"
      />
    </div>
  );
}

export default AdminOrdersPage;
