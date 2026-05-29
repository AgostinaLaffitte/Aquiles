import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { OrderService } from '../services/order.service';
import { formatPrice } from '../utils/productUtils';
import { ChevronLeft, Truck, Store, ShoppingBag, AlertCircle } from 'lucide-react';

export const Checkout = () => {
  const { 
    cart, 
    clearCart, 
    subtotalItems, 
    discountMayorista, 
    totalFinalPrice, 
    alcanzoMayorista 
  } = useCart();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryMethod: 'RETIRO' as 'RETIRO' | 'ENVIO',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase italic">Tu carrito está vacío</h2>
        <Link to="/productos" className="mt-4 inline-flex h-11 items-center bg-slate-950 text-white font-bold px-6 rounded-xl text-sm hover:bg-slate-800 transition-colors">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const itemsPayload = cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      const finalOrder = {
        ...formData,
        address: formData.deliveryMethod === 'RETIRO' ? '' : formData.address,
        city: formData.deliveryMethod === 'RETIRO' ? '' : formData.city,
        postalCode: formData.deliveryMethod === 'RETIRO' ? '' : formData.postalCode,
        items: itemsPayload
      };

      const createdOrder = await OrderService.create(finalOrder);
      clearCart();
      navigate('/pedido-confirmado', { state: { orderId: createdOrder.id } });

    } catch (error: any) {
      console.error('Error al procesar la orden:', error);
      setErrorMessage(error.response?.data?.message || 'Hubo un problema al procesar tu pedido. Por favor, intentá nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/productos" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight italic mb-8">
          Finalizar Pedido
        </h1>

        {/* Mensaje de error visual */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in">
            <AlertCircle size={20} />
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-3">1. Datos de Contacto</h2>
              <div className="space-y-3">
                <input type="text" required value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} placeholder="Nombre Completo" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="email" required value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} placeholder="Email" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                  <input type="tel" required value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder="Teléfono / WhatsApp" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-3">2. Método de Entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex flex-col items-center gap-2 p-4 border rounded-2xl cursor-pointer ${formData.deliveryMethod === 'RETIRO' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" onChange={() => setFormData({...formData, deliveryMethod: 'RETIRO'})} />
                  <Store size={20} /> <span className="text-sm font-bold">Retiro Local</span>
                </label>
                <label className={`flex flex-col items-center gap-2 p-4 border rounded-2xl cursor-pointer ${formData.deliveryMethod === 'ENVIO' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" onChange={() => setFormData({...formData, deliveryMethod: 'ENVIO'})} />
                  <Truck size={20} /> <span className="text-sm font-bold">Envío a Domicilio</span>
                </label>
              </div>
              {formData.deliveryMethod === 'ENVIO' && (
                <div className="space-y-3 pt-2">
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Dirección y Altura" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Ciudad" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                    <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} placeholder="CP" className="w-full h-12 px-4 rounded-xl border border-slate-200" />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full h-14 bg-slate-950 text-white font-black uppercase rounded-2xl disabled:opacity-50">
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>

          <div className="lg:col-span-5 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-fit">
            <h2 className="font-black mb-4">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span> <span>{formatPrice(subtotalItems)}</span></div>
              {alcanzoMayorista && <div className="text-emerald-600 font-bold">Desc. Mayorista: -{formatPrice(discountMayorista)}</div>}
              <div className="text-2xl font-black pt-4 border-t mt-2">Total: {formatPrice(totalFinalPrice)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};