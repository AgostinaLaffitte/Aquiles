import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/productUtils';
import { Trash2, Minus, Plus, ShoppingBag, AlertCircle, Percent, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/order.service';
import type { CreateOrderDto } from '../services/order.service';

export const CartPage = () => {
  const { 
    cart, updateQuantity, removeFromCart, clearCart, totalQuantity,
    getItemPriceDetails, subtotalItems, discountMayorista, totalFinalPrice, 
    montoMinimoMayorista, alcanzoMayorista, porcentajeMayorista 
  } = useCart();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nombreCliente, setNombreCliente] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState<'Envío' | 'Retiro'>('Envío');
  const [emailCliente, setEmailCliente] = useState(''); 
  const [telefonoCliente, setTelefonoCliente] = useState(''); 


  // Cálculos dinámicos de progreso
  const montoFaltante = Math.max(0, montoMinimoMayorista - subtotalItems);
  const porcentajeProgreso = montoMinimoMayorista > 0 ? Math.min((subtotalItems / montoMinimoMayorista) * 100, 100) : 100;

  
const handleCheckout = async () => {
  if (!user) {
    setAuthError('Debes iniciar sesión para finalizar la compra.');
    return;
  }

  // Validación completa
  if (!nombreCliente || !emailCliente || !telefonoCliente) {
    setAuthError('Por favor, completá todos tus datos de contacto.');
    return;
  }

  // Aseguramos que el método de entrega sea válido
  if (!metodoEntrega) {
    setAuthError('Por favor, seleccioná un método de entrega.');
    return;
  }

  setIsSubmitting(true);
  setAuthError(null); // Limpiar errores previos antes de intentar

  try {
    const orderData: CreateOrderDto = {
      customerName: nombreCliente,
      customerEmail: emailCliente,
      customerPhone: telefonoCliente,
      // IMPORTANTE: Asegúrate de enviar el valor correcto que espera tu backend
      deliveryMethod: metodoEntrega === 'Envío' ? 'ENVIO' : 'RETIRO', 
      paymentMethod: 'MERCADOPAGO',
      items: cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }))
    };

    const newOrder = await OrderService.create(orderData);

    const mensaje = `*¡Hola! Nuevo pedido #${newOrder.id}*\n*Cliente:* ${nombreCliente}\n*Total:* ${formatPrice(totalFinalPrice)}\n\nya estoy lista para coordinar metodo de pago y de entrega.espero sus indicaciones. ¡Gracias!`;
    
    window.open(`https://wa.me/5492284269809?text=${encodeURIComponent(mensaje)}`, '_blank');
    
    clearCart();
    navigate('/');
  } catch (error) {
    setAuthError('Error al procesar el pedido. Intentá más tarde.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-aquiles-neutral uppercase tracking-tight">Tu carrito está vacío</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Todavía no agregaste ninguna variante de producto a tu lote de compras.
        </p>
        <Link 
          to="/productos" 
          className="mt-6 inline-flex h-12 items-center justify-center px-6 bg-aquiles-primary text-aquiles-neutral font-black uppercase text-xs tracking-wider rounded-xl hover:bg-aquiles-accent hover:text-white transition-all duration-300 shadow-sm"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-slate-50/50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-black text-aquiles-neutral uppercase tracking-tight italic mb-8">
          Detalle de tu Carrito
        </h2>

        {/* BARRA DINÁMICA DE PROMO MAYORISTA */}
        {montoMinimoMayorista > 0 && (
          <div className={`p-5 rounded-3xl border transition-all mb-8 shadow-sm ${
            alcanzoMayorista 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {alcanzoMayorista 
                ? <Sparkles size={18} className="text-emerald-600 animate-pulse" /> 
                : <Percent size={18} className="text-amber-600" />
              }
              <span className="text-sm font-black uppercase tracking-tight">
                {alcanzoMayorista ? '¡Beneficio Mayorista Activado!' : 'Beneficio de Compra Mayorista'}
              </span>
            </div>

            {alcanzoMayorista ? (
              <p className="text-xs font-semibold">
                ¡Golazo! Se aplicó automáticamente un <strong>{porcentajeMayorista}% OFF extra</strong> sobre el total de tu pedido.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold">
                  Estás a <strong className="text-slate-900">${montoFaltante.toLocaleString('es-AR')}</strong> de bonificar un {porcentajeMayorista}% general en tu orden.
                </p>
                <div className="w-full bg-amber-200/40 h-2.5 rounded-full overflow-hidden border border-amber-200/60">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${porcentajeProgreso}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
            {/* LISTA DE PRODUCTOS */}
       <div className="lg:col-span-2 space-y-6">
        {/* 1. Definimos el objeto agrupado antes del map */}
        {(() => {
          const groupedCart = cart.reduce((acc, item) => {
            if (!acc[item.productId]) acc[item.productId] = [];
            acc[item.productId].push(item);
            return acc;
          }, {} as Record<number, typeof cart>);

          // 2. Mapeamos ese objeto para crear las tarjetas por producto
          return Object.entries(groupedCart).map(([productId, items]) => (
            <div key={productId} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <Link to={`/productos/${items[0].productId}`} className="block mb-4 hover:opacity-80 transition-opacity">
                <h4 className="font-black text-slate-800 text-lg">{items[0].productName}</h4>
              </Link>
              
              <div className="space-y-3">
              {items.map((item) => {
                const { originalPrice, finalPrice, hasDiscount } = getItemPriceDetails(item);
                return (
                  <div key={item.variantId} className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-4">
                    {/* Imagen */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.variantName}</p>
                        {hasDiscount && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">
                            ¡Oferta aplicada!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-9 px-2">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1"><Minus size={12} /></button>
                          <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1"><Plus size={12} /></button>
                        </div>
                        
                        <div className="text-right w-24">
                          {hasDiscount && (
                            <p className="text-[10px] text-slate-400 line-through">{formatPrice(originalPrice * item.quantity)}</p>
                          )}
                          <p className="text-sm font-black text-slate-800">{formatPrice(finalPrice * item.quantity)}</p>
                        </div>

                        <button onClick={() => removeFromCart(item.variantId)} className="text-slate-300 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          ));
        })()}
      </div>

          {/* RESUMEN DEL PEDIDO */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 sticky top-8">
            <h3 className="text-xl font-black text-aquiles-neutral uppercase tracking-tight">Resumen</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal ({totalQuantity} unidades totales)</span>
                <span className="font-bold">{formatPrice(subtotalItems)}</span>
              </div>
              
              {/* Sección Mayorista */}
              {alcanzoMayorista && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex justify-between text-emerald-800 font-bold text-sm">
                    <span>Descuento Mayorista ({porcentajeMayorista}%)</span>
                    <span>-{formatPrice(discountMayorista)}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-lg">Total Final</span>
                <span className="text-3xl font-black text-aquiles-accent">{formatPrice(totalFinalPrice)}</span>
              </div>
            </div>
           <div className="space-y-4 pt-4 border-t border-slate-100">
           
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Ej: Juan Pérez" 
              className={`w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border transition-all ${authError && !nombreCliente ? 'border-red-300' : 'border-slate-200 focus:border-aquiles-primary'}`}
              value={nombreCliente} 
              onChange={(e) => setNombreCliente(e.target.value)} 
            />
          </div>

          {/* Email (Ancho completo) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className={`w-full bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border transition-all ${authError && !emailCliente ? 'border-red-300' : 'border-slate-200'}`}
              value={emailCliente} 
              onChange={(e) => setEmailCliente(e.target.value)} 
            />
          </div>

            {/* Teléfono (Ancho completo) */}
            <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Teléfono (WhatsApp)</label>
            <div className={`flex bg-slate-50 rounded-xl border overflow-hidden focus-within:border-aquiles-primary transition-all ${authError && !telefonoCliente ? 'border-red-300' : 'border-slate-200'}`}>
              <span className="px-3 flex items-center text-slate-400 text-sm font-bold bg-slate-100/50">+54</span>
              <input 
                type="tel" 
                placeholder="2284..." 
                className="w-full bg-transparent px-3 py-3 text-sm outline-none" 
                value={telefonoCliente} 
                onChange={(e) => setTelefonoCliente(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>
          

            {/* Método de entrega */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Método de entrega</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Envío', 'Retiro'] as const).map((m) => (
                  <button 
                   type="button"
                    key={m} 
                    onClick={() => setMetodoEntrega(m)} 
                    className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                      metodoEntrega === m 
                        ? 'bg-aquiles-primary text-white border-aquiles-primary' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>



            {/* Mensaje de error único */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[11px] font-bold">
                <AlertCircle size={14} />
                <span>{authError}</span>
              </div>
            )}
          </div>
         

            <button 
                onClick={handleCheckout} 
                disabled={isSubmitting} // <-- Aquí es donde "lees" la variable
                className={`w-full h-14 bg-aquiles-primary text-aquiles-neutral font-black uppercase text-sm rounded-2xl transition-transform ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};