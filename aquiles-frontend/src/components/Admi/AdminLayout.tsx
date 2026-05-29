import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, FolderOpen, ReceiptText, Percent, Image, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import fondoMarca from '../../assets/fondo-footer.png';
import logoAquiles from '../../assets/logoAquiles.png';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Catálogo', icon: <ShoppingBag size={20} />, path: '/admin/productos' },
    { name: 'Categorías', icon: <FolderOpen size={20} />, path: '/admin/categorias' },
    { name: 'Órdenes', icon: <ReceiptText size={20} />, path: '/admin/ordenes' },
    { name: 'Ofertas y Promos', icon: <Percent size={20} />, path: '/admin/ofertas' },
    { name: 'Banners Inicio', icon: <Image size={20} />, path: '/admin/banners' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside 
        className={`relative text-white flex flex-col justify-between transition-all duration-300 border-r border-slate-800 sticky top-0 h-screen z-40 bg-cover bg-center ${isCollapsed ? 'w-20' : 'w-64'}`}
        style={{ backgroundImage: `url(${fondoMarca})` }} 
      >
       <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950/80 z-0"></div>
        <div className="relative z-10 flex flex-col flex-1">
          <div className="h-24 flex items-center justify-between px-4 border-b border-white/10">
            {!isCollapsed && <img src={logoAquiles} alt="Aquiles" className="h-12 object-contain" />}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg bg-white/10 hover:bg-yellow-400/20">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`flex items-center gap-3 h-11 px-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-yellow-400 text-slate-950' : 'text-slate-300 hover:text-yellow-400 hover:bg-white/5'}`}>
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="relative z-10 p-4 border-t border-white/10">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 font-bold">
            <LogOut size={20} /> {!isCollapsed && "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-10 bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <h2 className="font-bold text-slate-500 uppercase">Administración</h2>
          <Link to="/" className="text-xs font-bold border px-3 py-1.5 rounded-lg hover:bg-slate-100">Ver Tienda</Link>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};