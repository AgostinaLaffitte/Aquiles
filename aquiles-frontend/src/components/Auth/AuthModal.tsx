import { useState } from 'react';
import { X } from 'lucide-react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Añadimos md:h-[620px] para estabilizar la altura global del componente */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row md:h-[620px]">
        
        {/* Botón Flotante para Cerrar Modal */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 z-10 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-aquiles-neutral rounded-full transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        {/* COLUMNA IZQUIERDA: Inmersión Visual (Se congela con h-full de la altura padre) */}
        <div className="hidden md:block md:w-1/2 relative h-full">
          <img 
            src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=600&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Aquiles Store Experience"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aquiles-secondary/90 via-aquiles-secondary/40 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-white text-4xl font-black italic leading-none uppercase">
              AQUI<span className="text-aquiles-primary">LES</span>
            </h2>
            <p className="text-[12px] text-white/80 italic font-bold mt-1">Tu punto débil...</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: Ahora tiene h-full y flex-col justify-center, alineando todo siempre al centro exacto */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white h-full">
          {isLogin ? (
            <Login onSwitch={() => setIsLogin(false)} onSuccess={onClose} />
          ) : (
            <Register onSwitch={() => setIsLogin(true)} onSuccess={onClose} />
          )}
        </div>

      </div>
    </div>
  );
};