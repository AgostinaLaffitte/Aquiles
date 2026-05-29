import { useEffect, useState } from 'react';
import { ProductService } from '../services/product.service';
import { ProductList } from '../components/ProductList';
import type { Product } from '../types/product';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const loadFilteredProducts = async () => {
      try {
        setLoading(true);
        const catId = categoryFilter ? Number(categoryFilter) : undefined;
        const data = await ProductService.getAll(searchFilter, catId);
        setProducts(data);
      } catch (error) {
        console.error('Error al filtrar el catálogo de productos:', error);
        notify('No se pudieron cargar los productos. Intentá nuevamente más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadFilteredProducts(); 
  }, [searchFilter, categoryFilter]);

  return (
    
    <div className="min-h-screen bg-aquiles-background py-8 md:py-12">
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${notification.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      <div className="container mx-auto px-4">
        
        {/* Cabecera dinámica de la búsqueda */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-aquiles-neutral uppercase tracking-tight italic">
              {searchFilter ? `Resultados para: "${searchFilter}"` : 'Nuestro Catálogo'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}.
            </p>
          </div>
          
          {/* Indicador visual de filtros activos */}
          {(searchFilter || categoryFilter) && (
            <div className="flex items-center gap-2 self-start bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm text-slate-600 font-medium">
              <SlidersHorizontal size={14} className="text-aquiles-secondary" />
              Filtros activos
            </div>
          )}
        </div>

        {/* Zona de Renderizado */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-aquiles-secondary border-t-transparent"></div>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
};