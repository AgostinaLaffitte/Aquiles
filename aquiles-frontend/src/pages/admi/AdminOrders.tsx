import { useEffect, useState, useRef } from 'react';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/productUtils';
import { User, Truck, CreditCard, Eye, RefreshCw, Clipboard, MapPin, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'RETIRO' | 'ENVIO';
  address?: string;
  city?: string;
  status: string;
  total: number;
  items: any[];
}


const getStatusBadgeClass = (status: string) => {
  const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border";
  switch (status) {
    case 'PENDIENTE': return `${base} bg-amber-50 text-amber-600 border-amber-200`;
    case 'COMPLETADO': return `${base} bg-emerald-50 text-emerald-600 border-emerald-200`;
    case 'ENVIADO': return `${base} bg-blue-50 text-blue-600 border-blue-200`;
    case 'CANCELADO': return `${base} bg-rose-50 text-rose-600 border-rose-200`;
    default: return `${base} bg-slate-50 text-slate-600 border-slate-200`;
  }
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('TODAS');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
 
  // Función para mostrar notificaciones lindas
  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    if (selectedOrder && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.findAll();
      setOrders(data);
    } catch (error: any) {
      notify(error?.message || 'Error al cargar órdenes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);


const handleStatusChange = async (orderId: number, newStatus: string) => {
  // Si cancelan, guardamos el ID y abrimos el modal
  if (newStatus === 'CANCELADO') {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
    return;
  }
  
  // Si no es cancelar, lo hacemos directo
  await performStatusUpdate(orderId, newStatus);
};

const performStatusUpdate = async (orderId: number, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    await fetchOrders();
    notify('Estado actualizado correctamente', 'success');
  } catch (error: any) {
    notify(error?.response?.data?.message || 'Error al cambiar estado', 'error');
  } finally {
    setShowCancelModal(false);
    setOrderToCancel(null);
  }
};

  const copyInvoiceToClipboard = (order: any) => {
    const itemsText = order.items.map((i: any) => `- ${i.product.name} x${i.quantity}`).join('\n');
    const invoice = `PEDIDO #${order.id}\nCliente: ${order.customerName}\nTotal: ${formatPrice(order.total)}\n\nProductos:\n${itemsText}`;
    navigator.clipboard.writeText(invoice);
    notify('Detalle copiado al portapapeles', 'success');
  };

  const getGroupedOrders = (): Record<string, Order[]> => {
    const filtered = filterStatus === 'TODAS' ? orders : orders.filter(o => o.status === filterStatus);
    return filtered.reduce((groups: Record<string, Order[]>, order) => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(order);
      return groups;
    }, {});
  };

  const groupedOrders = getGroupedOrders();

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 relative">
      {/* Notificación elegante */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${notification.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Gestión de Órdenes</h1>
            <div className="flex gap-2 mt-4">
              {['TODAS', 'PENDIENTE', 'ENVIADO', 'COMPLETADO', 'CANCELADO'].map(status => (
                <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${filterStatus === status ? 'bg-slate-900 text-white' : 'bg-white border'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
          <button onClick={fetchOrders} className="p-3 bg-white border rounded-xl shadow-sm hover:border-slate-300">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {Object.entries(groupedOrders).map(([month, monthOrders]) => (
          <div key={month} className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{month}</h3>
            <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {monthOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-black text-slate-900">#{order.id}</td>
                      <td className="p-5 font-bold text-slate-700">{order.customerName}</td>
                      <td className="p-5 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 font-black">{formatPrice(order.total)}</td>
                      <td className="p-5"><span className={getStatusBadgeClass(order.status)}>{order.status}</span></td>
                      <td className="p-5 text-center"><button onClick={() => setSelectedOrder(order)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><Eye size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div ref={detailRef}>
          {selectedOrder && (
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 shadow-2xl mt-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Pedido #{selectedOrder.id}</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => copyInvoiceToClipboard(selectedOrder)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800"><Clipboard size={14} /> Copiar Boleta</button>
                    <button onClick={() => setSelectedOrder(null)} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase">Cerrar</button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Estado</span>
                  <select value={selectedOrder.status} onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)} className="block mt-1 bg-slate-100 border-none font-bold text-sm rounded-xl p-2 cursor-pointer">
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="ENVIADO">ENVIADO</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><User size={14} /> Contacto</h3>
                  <p className="font-black text-lg">{selectedOrder.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={14}/> {selectedOrder.customerEmail}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Phone size={14}/> {selectedOrder.customerPhone}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Truck size={14} /> Envío</h3>
                  <p className="font-bold">{selectedOrder.deliveryMethod}</p>
                  <div className="flex items-start gap-2 text-sm text-slate-600"><MapPin size={14} className="mt-1"/> {selectedOrder.address ? `${selectedOrder.address}, ${selectedOrder.city}` : 'Retiro en local'}</div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2"><CreditCard size={14} /> Detalle de artículos</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-sm">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">Var: {item.variant?.name || 'Única'} | Cant: {item.quantity}</p>
                      </div>
                      <span className="font-black">{formatPrice(Number(item.priceAtPurchase) * Number(item.quantity))}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                  <span className="font-black uppercase tracking-widest text-sm opacity-80">Total del pedido</span>
                  <span className="text-2xl font-black">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
          {showCancelModal && (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <h3 className="font-black text-slate-800 uppercase text-lg mb-2">¿Confirmar cancelación?</h3>
          <p className="text-slate-500 text-xs mb-6">Esta acción devolverá los productos al inventario. ¿Estás segura?</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
            >
              No, volver
            </button>
            <button 
              onClick={() => orderToCancel && performStatusUpdate(orderToCancel, 'CANCELADO')}
              className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};