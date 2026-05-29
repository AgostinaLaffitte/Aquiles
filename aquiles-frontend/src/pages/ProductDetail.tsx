// src/pages/ProductDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, CheckCircle2,AlertCircle,CheckCircle}from 'lucide-react';
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
          // --- AQUÍ ESTÁ EL CAMBIO ---
          // Al cargar, recorremos las variantes y buscamos si ya existen en el carrito
          const initialQuantities: { [key: number]: number } = {};
          data.variants.forEach((v) => {
            const itemEnCarrito = cart.find(c => c.variantId === v.id);
            // Si existe en el carrito, tomamos su cantidad, si no, ponemos 0
            initialQuantities[v.id] = itemEnCarrito ? itemEnCarrito.quantity : 0;
          });
          setQuantities(initialQuantities);
          // ---------------------------
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

  // Lógica para pasar las imágenes con flechas direccionales
  const handlePrevImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    if (currentIndex === -1) return;
    // Si está en la primera, va a la última de forma cíclica
    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setActiveImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = product.images.indexOf(activeImage);
    if (currentIndex === -1) return;
    // Si está en la última, vuelve a la primera
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
      if (parsedValue > maxStock) {
        setQuantities((prev) => ({ ...prev, [variantId]: maxStock }));
      } else {
        setQuantities((prev) => ({ ...prev, [variantId]: parsedValue }));
      }
    }
  };

  const handleAddMultipleToCart = () => {
    const itemsToAdd = product.variants
      .filter((v) => quantities[v.id] > 0)
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
    const resetQuantities = { ...quantities };
    Object.keys(resetQuantities).forEach((key) => { resetQuantities[Number(key)] = 0; });
    setQuantities(resetQuantities);
  };

  const totalSelectedItems = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-aquiles-background py-8 md:py-12">
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

        {/* BLOQUE SUPERIOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100 mb-8">
          
          {/* Galería Izquierda */}
          <div className="space-y-4 w-full">
            {/* Contenedor imagen grande con grupo hover */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group/gallery">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              
              {product.isOffer && (
                <span className="absolute top-4 left-4 z-10 bg-aquiles-accent text-white text-xs font-black uppercase px-3 py-1.5 rounded-full tracking-wider shadow-sm">
                  Oferta
                </span>
              )}

              {/* Botones direccionales sobre la imagen principal (solo si hay más de 1 imagen) */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-white transition-all md:opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow hover:bg-white transition-all md:opacity-0 group-hover/gallery:opacity-100"
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-aquiles-secondary shadow-sm' : 'border-slate-100'}`}
                  >
                    <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ficha Derecha */}
          <div className="flex flex-col justify-between h-full pt-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-aquiles-neutral tracking-tight uppercase italic">
                {product.name}
              </h2>
              
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-3xl font-black text-aquiles-accent">
                  {product.isOffer && product.offerPrice ? formatPrice(product.offerPrice) : formatPrice(product.price)}
                </span>
                {product.isOffer && product.offerPrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Descripción</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden md:block">
              <p className="text-xs text-slate-500 font-medium">
                💡 Elegí abajo las cantidades de cada variante que necesitás y agregalas todas juntas al carrito de compras.
              </p>
            </div>
          </div>

        </div>

        {/* BLOQUE INFERIOR: Variantes */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-slate-100">
          <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-aquiles-neutral uppercase tracking-tight">
                Variantes Disponibles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Gestioná las unidades de cada modelo en tiempo real.</p>
            </div>

            {totalSelectedItems > 0 && (
              <span className="inline-flex items-center gap-1.5 self-start sm:self-center bg-cyan-50 border border-aquiles-secondary/30 text-aquiles-secondary font-bold text-xs px-3 py-1.5 rounded-full animate-fadeIn">
                <CheckCircle size={14} />
                {totalSelectedItems} unidades preparadas
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {product.variants.map((variant) => {
              const currentQty = quantities[variant.id] || 0;
              const hasStock = variant.stock > 0;
              const variantPrice = variant.price ? variant.price : product.price;

              return (
                <div 
                  key={variant.id} 
                  className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${currentQty > 0 ? 'bg-slate-50/50 -mx-6 px-6' : ''}`}
                >
                  <div className="flex-1">
                    <span className={`font-bold text-base block ${hasStock ? 'text-slate-800' : 'text-slate-300 line-through'}`}>
                      {variant.name}
                    </span>
                    <span className="text-xs font-black text-aquiles-accent block mt-0.5">
                      {formatPrice(variantPrice)}
                    </span>
                  </div>

                  <div className="sm:w-36">
                    {hasStock ? (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${variant.stock <= 3 ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                        {variant.stock <= 3 ? `¡Últimas ${variant.stock} u!` : `${variant.stock} disponibles`}
                      </span>
                    ) : (
                      <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sin Stock
                      </span>
                    )}
                  </div>

                  <div className="flex items-center bg-white border-2 border-slate-200 rounded-xl h-11 w-36 px-1.5 shadow-sm">
                    <button 
                      onClick={() => handleQuantityClick(variant.id, variant.stock, 'decrease')}
                      disabled={currentQty <= 0 || !hasStock}
                      className="p-1 text-slate-400 hover:text-aquiles-neutral transition-colors disabled:opacity-20"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    
                    <input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={!hasStock}
                      value={currentQty === 0 ? '' : currentQty}
                      onChange={(e) => handleInputChange(variant.id, variant.stock, e.target.value)}
                      placeholder="0"
                      className="w-full text-center font-black text-aquiles-neutral bg-transparent outline-none text-sm disabled:text-slate-300"
                    />

                    <button 
                      onClick={() => handleQuantityClick(variant.id, variant.stock, 'increase')}
                      disabled={currentQty >= variant.stock || !hasStock}
                      className="p-1 text-slate-400 hover:text-aquiles-neutral transition-colors disabled:opacity-20"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleAddMultipleToCart}
              disabled={totalSelectedItems === 0}
              className="w-full sm:w-auto px-8 h-14 bg-aquiles-primary text-aquiles-neutral font-black uppercase tracking-wider text-sm rounded-xl hover:bg-aquiles-accent hover:text-white transition-all duration-300 shadow-md flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} strokeWidth={2.5} />
              Agregar selección al carrito ({totalSelectedItems})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};