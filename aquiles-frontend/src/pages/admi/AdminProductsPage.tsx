// src/pages/AdminProductsPage.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Layers, FolderOpen, Loader2, AlertCircle,CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import type { Product } from '../../types/product';


export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ID del producto que está en estado de "confirmación de borrado"
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al traer productos de la base de datos:', error);
      notify('Error al cargar los productos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setIsDeleting(true);
      await api.delete(`/products/${id}`);
      notify('Producto eliminado con éxito.', 'success');
      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      notify('No se pudo eliminar el producto. Comprobá las dependencias o variantes.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchId = product.id.toString() === searchTerm.trim();
    return matchName || matchId;
  });

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${notification.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      {/* Encabezado con Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gestión de Catálogo</h1>
          <p className="text-xs text-slate-400 mt-1">Buscá, editá precios, stock y variantes de tus productos.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* BOTÓN REFORMULADO: Ahora te redirige a la gestión de categorías */}
          <Link
            to="/admin/categorias"
            className="h-10 px-4 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-aquiles-secondary hover:text-aquiles-secondary transition-all font-bold text-xs flex items-center gap-2 bg-white"
          >
            <FolderOpen size={16} />
            Ver Categorías
          </Link>

          <Link
            to="/admin/productos/nuevo"
            className="h-10 px-5 rounded-xl bg-slate-900 text-white hover:bg-aquiles-accent transition-all font-black text-xs flex items-center gap-2 uppercase tracking-wider shadow-sm"
          >
            <Plus size={16} />
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Barra de Búsqueda Inteligente */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre o código ID (ej: 1)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-12 focus:border-aquiles-primary focus:ring-1 focus:ring-aquiles-primary outline-none transition-all text-sm font-medium shadow-sm"
        />
        <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
      </div>

      {/* TABLA DE PRODUCTOS REALES */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-aquiles-primary" />
              <span className="text-sm font-medium">Conectando con la base de datos...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6">Código (ID)</th>
                  <th className="py-4 px-6">Producto</th>
                  <th className="py-4 px-6">Categorías</th>
                  <th className="py-4 px-6">Precio Base</th>
                  <th className="py-4 px-6">Variantes / Stock Total</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredProducts.map((product) => {
                  const totalStock = product.variants?.reduce((acc, curr) => acc + curr.stock, 0) || 0;
                  const isConfirmingDelete = deletingProductId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-slate-400 font-mono font-bold">#{product.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{product.name}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {product.categories?.map(cat => (
                            <span key={cat.id} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                              {cat.name}
                            </span>
                          ))}
                          {product.categories?.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Sin categoría</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">${product.price.toLocaleString('es-AR')}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Layers size={12} /> {product.variants?.length || 0} variantes
                          </span>
                          <span className={`text-xs font-black ${totalStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {totalStock > 0 ? `${totalStock} unidades disp.` : 'Sin stock'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/admin/productos/editar/${product.id}`}
                            className="p-2 inline-flex items-center justify-center text-slate-500 hover:text-aquiles-accent hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar Producto"
                          >
                            <Edit2 size={16} />
                          </Link>

                          {/* FLUJO DE ELIMINACIÓN SEGURO */}
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isDeleting}
                                className="px-2 py-1 text-[10px] font-black uppercase text-red-600 hover:bg-red-200 rounded-md transition-colors"
                              >
                                {isDeleting ? 'Borrando...' : 'Sí, borrar'}
                              </button>
                              <button
                                onClick={() => setDeletingProductId(null)}
                                disabled={isDeleting}
                                className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingProductId(product.id)}
                              className="p-2 inline-flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar Producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No hay productos cargados en tu base de datos o ninguno coincide con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};