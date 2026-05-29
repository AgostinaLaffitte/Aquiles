// src/pages/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import { ShoppingBag, FolderOpen, ReceiptText, Percent, Image } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">
            Panel de Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestión interna de catálogo, variantes, secciones y banners de Aquiles.</p>
        </div>
      </div>

      {/* Grid de Accesos Rápidos - Sincronizado con Sidebar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Catálogo de Productos */}
        <Link to="/admin/productos" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-aquiles-primary hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-800">Catálogo</span>
            <span className="text-xs text-slate-400">Modificar precios y stock</span>
          </div>
        </Link>

        {/* Gestión de Categorías */}
        <Link to="/admin/categorias" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-aquiles-primary hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
            <FolderOpen size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-800">Categorías</span>
            <span className="text-xs text-slate-400">Administrar nombres y fotos</span>
          </div>
        </Link>

        {/* Órdenes de Pedidos */}
        <Link to="/admin/ordenes" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-aquiles-primary hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <ReceiptText size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-800">Órdenes</span>
            <span className="text-xs text-slate-400">Ver pedidos de clientes</span>
          </div>
        </Link>

        {/* Ofertas y Promociones */}
        <Link to="/admin/ofertas" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-aquiles-primary hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <Percent size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-800">Ofertas y Promos</span>
            <span className="text-xs text-slate-400">Configurar descuentos</span>
          </div>
        </Link>

        {/* Banners Inicio */}
        <Link to="/admin/banners" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:border-aquiles-primary hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <Image size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-slate-800">Banners Inicio</span>
            <span className="text-xs text-slate-400">Cambiar carrusel principal</span>
          </div>
        </Link>

      </div>
    </div>
  );
};