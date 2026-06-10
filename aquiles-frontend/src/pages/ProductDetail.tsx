// src/pages/ProductDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, CheckCircle2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatPrice } from '../utils/productUtils';
import { ProductService } from '../services/product.service';
import type { Product } from '../types/product';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { addToCart, cart } = useCart();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const productId = Number(id);
      if (isNaN(productId)) return;
      
      try {
        setLoading(true);
        const data = await ProductService.getById(productId);
        setProduct(data);
        
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }

        if (data.variants) {
          const initialQuantities: { [key: number]: number } = {};
          data.variants.forEach((v) => {
            const itemEnCarrito = cart.find(c => c.variantId === v.id);
            initialQuantities[v.id] = itemEnCarrito ? itemEnCarrito.quantity : 0;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error('Error al traer el detalle del producto:', error);
        notify('No se pudo cargar el producto. Intentá nuevamente más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, cart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aquiles-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-aquiles-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-aquiles-background p-4 text-center">
        <p className="text-gray-500 text-lg">El producto no se encuentra disponible.</p>
        <Link to="/productos" className="mt-4 text-aquiles-secondary font-bold hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  const handlePrevImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setActiveImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    if (currentIndex === -1) return;
    const nextIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setActiveImage(product.images[nextIndex]);
  };

  const handleQuantityClick = (variantId: number, maxStock: number, type: 'increase' | 'decrease') => {
    const currentQty = quantities[variantId] || 0;
    if (type === 'increase' && currentQty < maxStock) {
      setQuantities((prev) => ({ ...prev, [variantId]: currentQty + 1 }));
    } else if (type === 'decrease' && currentQty > 0) {
      setQuantities((prev) => ({ ...prev, [variantId]: currentQty - 1 }));
    }
  };

  const handleInputChange = (variantId: number, maxStock: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue === '') {
      setQuantities((prev) => ({ ...prev, [variantId]: 0 }));
      return;
    }
    const parsedValue = parseInt(cleanValue, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setQuantities((prev) => ({ ...prev, [variantId]: parsedValue > maxStock ? maxStock : parsedValue }));
    }
  };

  const handleAddMultipleToCart = () => {
    const itemsToAdd = product.variants
      .filter((v) => (quantities[v.id] || 0) > 0)
      .map((v) => ({
        productId: product.id,
        productName: product.name,
        variantId: v.id,
        variantName: v.name,
        price: v.price ? v.price : (product.isOffer && product.offerPrice ? product.offerPrice : product.price),
        image: product.images[0],
        quantity: quantities[v.id],
        stockMax: v.stock
      }));

    if (itemsToAdd.length === 0) return;
    addToCart(itemsToAdd);
    notify('Productos agregados al carrito', 'success');
    
    const resetQuantities = { ...quantities };
    Object.keys(resetQuantities).forEach((key) => { resetQuantities[Number(key)] = 0; });
    setQuantities(resetQuantities);
  };

  const totalSelectedItems = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-aquiles-background py-8 md:py-12 pb-24 md:pb-12">
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${notification.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/productos" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-aquiles-neutral transition-colors mb-8 group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start bg-white p-4 md:p-10 rounded-[24px] shadow-sm border border-slate-100 mb-6">
           <div className="space-y-3">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 relative group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {product.isOffer && <span className="absolute top-4 left-4 z-10 bg-aquiles-accent text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-sm">Oferta</span>}
              {product.images.length > 1 && (
                <>
                  <button type="button" onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={20} /></button>
                  <button type="button" onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={20} /></button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between h-full pt-2">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-aquiles-neutral uppercase italic">{product.name}</h2>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-3xl font-black text-aquiles-accent">{product.isOffer && product.offerPrice ? formatPrice(product.offerPrice) : formatPrice(product.price)}</span>
              </div>
              <div className="mt-6 text-sm text-slate-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE INFERIOR: Variantes con los 2 cambios */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
          <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-aquiles-neutral uppercase tracking-tight">Variantes</h3>
            
            {/* CAMBIO 1: Botón escritorio */}
            <button 
              onClick={handleAddMultipleToCart}
              disabled={totalSelectedItems === 0}
              className="hidden md:flex items-center gap-2 bg-aquiles-primary px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-aquiles-accent hover:text-white transition-all disabled:opacity-50"
            >
              <ShoppingBag size={16} /> Agregar al carrito ({totalSelectedItems})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {product.variants.map((variant) => {
              const currentQty = quantities[variant.id] || 0;
              const hasStock = variant.stock > 0;
              
              return (
                <div key={variant.id} className="py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base text-slate-800">{variant.name}</span>
                    {/* CAMBIO 2: Aviso de stock claro */}
                    {hasStock ? (
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Stock disponible: {variant.stock}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-500 uppercase italic">Sin stock actualmente</span>
                    )}
                  </div>

                  {hasStock ? (
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-12 w-32 px-1">
                      <button onClick={() => handleQuantityClick(variant.id, variant.stock, 'decrease')} className="w-10 h-10 flex items-center justify-center text-slate-500"><Minus size={16} /></button>
                      <input type="number" value={currentQty || ''} onChange={(e) => handleInputChange(variant.id, variant.stock, e.target.value)} className="w-full text-center font-black bg-transparent outline-none" />
                      <button onClick={() => handleQuantityClick(variant.id, variant.stock, 'increase')} className="w-10 h-10 flex items-center justify-center text-slate-500"><Plus size={16} /></button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-slate-300 italic">Agotado</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón Sticky Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t border-slate-100 z-50">
        <button onClick={handleAddMultipleToCart} disabled={totalSelectedItems === 0} className="w-full h-14 bg-aquiles-primary text-aquiles-neutral font-black uppercase text-sm rounded-xl hover:bg-aquiles-accent hover:text-white transition-all disabled:opacity-50">
          Agregar ({totalSelectedItems})
        </button>
      </div>
    </div>
  );
};