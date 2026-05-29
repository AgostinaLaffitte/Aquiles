import { useState } from 'react';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { AuthModal } from './Auth/AuthModal'; 
import fondoMarca from '../assets/fondo-footer.png';
import logoAquiles from '../assets/logoAquiles.png';

export const Header = () => {
  const { user, logout } = useAuth(); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { totalQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/productos');
    }
  };

  return (
    <header className="relative w-full bg-slate-950 text-white border-b border-slate-900 sticky top-0 z-50 bg-cover bg-center bg-no-repeat shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
     style={{ backgroundImage: `url(${fondoMarca})` }}>
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950/80 z-0"></div>
      <div className="relative z-10 w-full px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* CAMBIO: Logo en lugar de bloques de texto */}
          <Link to="/">
            <img src={logoAquiles} alt="Aquiles" className="h-16 object-contain" />
          </Link>
          <nav className="hidden md:flex gap-6 font-black text-xs uppercase tracking-wider text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Inicio</Link>
            <Link to="/productos" className="hover:text-yellow-400 transition-colors">Productos</Link>
            <Link to="/ayuda" className="hover:text-yellow-400 transition-colors">Ayuda</Link>
          </nav>
        </div>

        {/* Buscador y Controles */}
        <div className="flex items-center gap-6 flex-1 justify-end max-w-2xl">
          
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block shadow-md rounded-full">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-full py-2 pl-4 pr-12 text-sm text-white placeholder-slate-400 focus:border-slate-600 outline-none transition-colors backdrop-blur-sm font-medium"
            />
            <button type="submit" className="absolute right-4 top-2.5 text-slate-400 hover:text-white transition-colors" title="Buscar">
              <Search size={18} />
            </button>
          </form>
          
          <div className="flex items-center gap-3 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
            
            {/* Control de Sesión */}
            {user ? (
              <div className="flex items-center gap-3">
                
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="h-9 inline-flex items-center justify-center font-black bg-white text-slate-950 px-4 rounded-xl hover:bg-yellow-400 transition-all duration-300 text-xs uppercase tracking-wider shadow-md"
                  >
                    Panel Admin
                  </Link>
                )}

                <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 h-9 px-4 rounded-xl shadow-md backdrop-blur-sm">
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {user.email}
                  </span>
                  <div className="w-px h-4 bg-slate-800" />
                  <button 
                    onClick={logout} 
                    title="Cerrar Sesión"
                    className="text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center"
                  >
                    <LogOut size={15} />
                  </button>
                </div>

              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="h-9 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-white hover:text-yellow-400 transition-colors px-3 rounded-xl"
              >
                <User size={16} />
                <span>Ingresar</span>
              </button>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="relative p-2 text-white hover:text-yellow-400 transition-colors rounded-xl hover:bg-slate-950/40">
              <ShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-slate-950 font-black text-[9px] w-4.5 h-4.5 rounded-md flex items-center justify-center shadow-md">
                  {totalQuantity}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};