import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { AuthModal } from './Auth/AuthModal'; 
import fondoMarca from '../assets/fondo-footer.png';
import logoAquiles from '../assets/logoAquiles.png';
import { Search, ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { totalQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificamos si es admin (ajusta 'ADMIN' según el valor que recibas en tu objeto user)
  const isAdmin = user?.role === 'ADMIN';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/productos');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="relative w-full bg-slate-950 text-white border-b border-slate-900 sticky top-0 z-50 bg-cover bg-center bg-no-repeat shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      style={{ backgroundImage: `url(${fondoMarca})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950/80 z-0"></div>
      
      <div className="relative z-10 w-full px-4 md:px-12 h-20 md:h-24 flex items-center justify-between gap-4">
        
        {/* Lado Izquierdo: Menú, Logo y Navegación */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex-shrink-0">
            <img src={logoAquiles} alt="Aquiles" className="h-10 md:h-16 object-contain" />
          </Link>
          <nav className="hidden md:flex gap-6 ml-6 font-black text-xs uppercase tracking-wider">
            <Link to="/" className="hover:text-yellow-400">Inicio</Link>
            <Link to="/productos" className="hover:text-yellow-400">Productos</Link>
            <Link to="/ayuda" className="hover:text-yellow-400">Ayuda</Link>
            {isAdmin && (
              <Link to="/admin" className="text-yellow-400 flex items-center gap-1 hover:text-white transition-colors">
                <LayoutDashboard size={14} /> Panel Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Lado Derecho: Buscador y Acciones */}
        <div className="flex items-center gap-3 md:gap-6">
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64 lg:w-96">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm focus:border-yellow-400 outline-none transition-colors backdrop-blur-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400"><Search size={16} /></button>
          </form>
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-3 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="text-[10px] truncate max-w-[80px]">{user.email}</span>
                <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors"><LogOut size={14} /></button>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase hover:text-yellow-400 transition-colors">
                <User size={16} /> Ingresar
              </button>
            )}

            <Link to="/carrito" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menú Mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-slate-800 p-4 flex flex-col gap-4 shadow-2xl z-50">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm"
            />
          </form>
          <div className="flex flex-col gap-4 text-sm font-bold border-t border-slate-800 pt-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)}>Productos</Link>
            <Link to="/ayuda" onClick={() => setIsMenuOpen(false)}>Ayuda</Link>
            
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-yellow-400 flex items-center gap-2">
                <LayoutDashboard size={16} /> Panel Admin
              </Link>
            )}
            
            {user ? (
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-400">Cerrar Sesión</button>
            ) : (
              <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="text-left text-yellow-400">Ingresar</button>
            )}
          </div>
        </div>
      )}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};