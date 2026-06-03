// src/pages/AdminOffersPage.tsx
import { useState, useEffect } from 'react';
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2, Loader2, Percent, Layers, ShoppingCart,CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Promotion {
  id: number;
  name: string;
  description?: string;
  type: 'PORCENTAJE' | 'CANTIDAD' | 'TOTAL_CARRITO';
  minQuantity: number;
  discountValue: number;
  active: boolean;
  productId?: number | null;
  categoryId?: number | null;
}

export const AdminOffersPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos del Formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PORCENTAJE' | 'CANTIDAD' | 'TOTAL_CARRITO'>('PORCENTAJE');
  const [minQuantity, setMinQuantity] = useState(1);
  const [discountValue, setDiscountValue] = useState(0);
  // Se agregó este estado para que el Mayorista no pise el discountValue de las otras
  const [wholesaleDiscount, setWholesaleDiscount] = useState(0);
  
  // Alcance de la promo
  const [scope, setScope] = useState<'GLOBAL' | 'PRODUCTO' | 'CATEGORIA'>('GLOBAL');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [promosRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/promotions'),
        api.get('/products'),
        api.get('/categories')
      ]);
      setPromotions(promosRes.data);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      notify('Error al cargar los datos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/promotions/${id}/toggle`, { active: !currentStatus });
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      notify('No se pudo actualizar el estado.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!promoToDelete) return;
    try {
      await api.delete(`/promotions/${promoToDelete}`);
      setPromotions(prev => prev.filter(p => p.id !== promoToDelete));
      notify('Promoción eliminada con éxito.', 'success');
    } catch (error) {
      notify('Error al intentar eliminar la promoción.', 'error');
    } finally {
      setPromoToDelete(null); // Cerramos el modal
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const data = {
        name,
        description,
        type,
        minQuantity: type === 'TOTAL_CARRITO' ? minQuantity : minQuantity,
        discountValue: type === 'TOTAL_CARRITO' ? wholesaleDiscount : discountValue,
        active: true,
        productId: scope === 'PRODUCTO' && selectedProductId ? Number(selectedProductId) : null,
        categoryId: scope === 'CATEGORIA' && selectedCategoryId ? Number(selectedCategoryId) : null
      };

      const response = await api.post('/promotions', data);
      setPromotions(prev => [response.data, ...prev]);
      setShowModal(false);
      
      setName('');
      setDescription('');
      setType('PORCENTAJE');
      setMinQuantity(1);
      setDiscountValue(0);
      setWholesaleDiscount(0);
      setScope('GLOBAL');
      setSelectedProductId('');
      setSelectedCategoryId('');
    } catch (error) {
      console.error('Error al guardar promo:', error);
      notify('Error al guardar la regla.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notificación flotante */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${notification.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Estrategias de Descuento</h1>
          <p className="text-xs text-slate-400 mt-1">Configurá rebajas fijas, beneficios por cantidad o descuentos mayoristas.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 rounded-xl bg-slate-900 text-white hover:bg-aquiles-accent transition-all font-black text-xs flex items-center gap-2 uppercase tracking-wider"
        >
          <Plus size={16} />
          Crear Regla / Promo
        </button>
      </div>

      {/* Listado */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 size={32} className="animate-spin text-aquiles-primary" />
          <span className="text-sm font-medium">Sincronizando reglas comerciales...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm ${
                promo.active ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60'
              }`}
            >
              <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 bg-slate-50 text-slate-600">
                {promo.type === 'PORCENTAJE' && <Percent size={12} />}
                {promo.type === 'CANTIDAD' && <Layers size={12} />}
                {promo.type === 'TOTAL_CARRITO' && <ShoppingCart size={12} />}
                {promo.type}
              </div>

              <h3 className="text-lg font-black text-slate-800 uppercase pr-28 truncate">{promo.name}</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{promo.description || 'Sin descripción.'}</p>

              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider">
                {promo.productId && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Producto ID: #{promo.productId}</span>}
                {promo.categoryId && <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Categoría ID: #{promo.categoryId}</span>}
                {!promo.productId && !promo.categoryId && <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Aplica a Toda la Tienda</span>}
              </div>

              <div className="mt-4 bg-slate-50 rounded-xl p-3 text-xs font-medium text-slate-600 space-y-1">
                {promo.type === 'PORCENTAJE' && <p>Aplica un <span className="font-bold text-aquiles-accent">{promo.discountValue}% OFF</span></p>}
                {promo.type === 'CANTIDAD' && <p>Llevando {promo.minQuantity}+ uds, cada una cuesta <span className="font-bold text-emerald-600">${promo.discountValue}</span>.</p>}
                {promo.type === 'TOTAL_CARRITO' && <p>Si el total supera <span className="font-bold text-slate-800">${promo.minQuantity}</span>, aplica <span className="font-bold text-blue-600">{promo.discountValue}% OFF</span>.</p>}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <button onClick={() => handleToggleActive(promo.id, promo.active)} className="flex items-center gap-1.5 text-xs font-bold">
                  {promo.active ? <ToggleRight size={22} className="text-emerald-600" /> : <ToggleLeft size={22} className="text-slate-400" />}
                  {promo.active ? 'Activa' : 'Pausada'}
                </button>
                <button onClick={() => setPromoToDelete(promo.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
     
  )}
     
    

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Tag size={18} /> Nueva Regla Comercial
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Nombre</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl p-2 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Tipo</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border rounded-xl p-2 text-sm">
                <option value="PORCENTAJE">Porcentaje Directo</option>
                <option value="CANTIDAD">Descuento por Volumen</option>
                <option value="TOTAL_CARRITO">Monto Mínimo (Mayorista)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">¿A qué aplica?</label>
              <select value={scope} onChange={e => setScope(e.target.value as any)} className="w-full border rounded-xl p-2 text-sm">
                <option value="GLOBAL">Global</option>
                <option value="PRODUCTO">Producto ({products.length} cargados)</option>
                <option value="CATEGORIA">Categoría ({categories.length} cargadas)</option>
              </select>
            </div>

           {scope === 'PRODUCTO' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                ID del Producto
              </label>
              <input 
                type="number" 
                required 
                placeholder="Ej: 123"
                value={selectedProductId} 
                onChange={e => setSelectedProductId(e.target.value)} 
                className="w-full border rounded-xl p-2 text-sm" 
              />
              {/* Opcional: una pequeña ayuda visual para verificar que el ID existe */}
              {selectedProductId && (
                <p className="text-[10px] text-slate-400">
                  Buscando producto: {products.find(p => p.id === Number(selectedProductId))?.name || "Producto no encontrado"}
                </p>
              )}
            </div>
)}

            {scope === 'CATEGORIA' && (
              <select required value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} className="w-full border rounded-xl p-2 text-sm">
                <option value="">-- Seleccionar categoría --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">{type === 'TOTAL_CARRITO' ? 'Monto Mínimo' : 'Cant. Mínima'}</label>
                <input type="number" required value={minQuantity} onChange={e => setMinQuantity(+e.target.value)} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">{type === 'TOTAL_CARRITO' ? '% Descuento' : 'Valor'}</label>
                <input 
                  type="number" required 
                  value={type === 'TOTAL_CARRITO' ? wholesaleDiscount : discountValue} 
                  onChange={e => type === 'TOTAL_CARRITO' ? setWholesaleDiscount(+e.target.value) : setDiscountValue(+e.target.value)} 
                  className="w-full border rounded-lg p-2" 
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white p-3 rounded-xl font-black uppercase text-xs">
              {isSubmitting ? 'Guardando...' : 'Crear Regla'}
            </button>
          </form>
        </div>
      )}

          {promoToDelete && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
          <h3 className="font-black text-slate-800 uppercase text-lg mb-2">¿Estás segura?</h3>
          <p className="text-slate-500 text-sm mb-6">Esta promoción se eliminará permanentemente.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setPromoToDelete(null)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};