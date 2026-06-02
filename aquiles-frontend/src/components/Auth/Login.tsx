import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export const Login = ({ onSwitch, onSuccess }: LoginProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center animate-fadeIn">
      <div className="mb-8">
        <h3 className="text-3xl font-black text-aquiles-neutral tracking-tight uppercase italic">
          Iniciar Sesión
        </h3>
        <p className="text-sm text-gray-500 mt-1">Qué bueno verte de nuevo en Aquiles.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@aquiles.com"
            // text-base evita el zoom automático en iOS
            className="w-full border-2 border-gray-100 rounded-2xl py-3.5 px-4 text-base md:text-sm focus:border-aquiles-primary outline-none transition-colors text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border-2 border-gray-100 rounded-2xl py-3.5 px-4 text-base md:text-sm focus:border-aquiles-primary outline-none transition-colors text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-aquiles-primary text-aquiles-neutral font-black uppercase tracking-wider py-4 rounded-2xl hover:bg-aquiles-accent hover:text-white transition-all duration-300 shadow-md disabled:opacity-50 mt-4"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-600">
          ¿No tenés una cuenta todavía?{' '}
          <button
            onClick={onSwitch}
            className="text-aquiles-accent font-bold hover:underline transition-all block w-full mt-2 md:inline md:w-auto md:mt-0"
          >
            Registrate acá
          </button>
        </p>
      </div>
    </div>
  );
};