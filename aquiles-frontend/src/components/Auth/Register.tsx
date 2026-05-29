import { useState } from 'react';
import { AuthService } from '../../services/auth.service';

interface RegisterProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export const Register = ({ onSwitch, onSuccess }: RegisterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
    }

    try {
      setLoading(true);
      await AuthService.register({ email, password });
      setSuccess(true);
      setTimeout(() => {
        onSwitch();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al intentar registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-3xl font-black text-aquiles-neutral tracking-tight uppercase italic">
          Crear Cuenta
        </h3>
        <p className="text-sm text-gray-500 mt-1">Sumate a Aquiles y gestioná tus compras.</p>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-xl font-medium">
          ¡Cuenta creada con éxito! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@aquiles.com"
            className="w-full border-2 border-gray-100 rounded-2xl py-3 px-4 focus:border-aquiles-primary outline-none transition-colors text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full border-2 border-gray-100 rounded-2xl py-3 px-4 focus:border-aquiles-primary outline-none transition-colors text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí tu contraseña"
            className="w-full border-2 border-gray-100 rounded-2xl py-3 px-4 focus:border-aquiles-primary outline-none transition-colors text-slate-900"
          />
        </div>

        <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-aquiles-primary text-aquiles-neutral font-black uppercase tracking-wider py-4 rounded-2xl hover:bg-aquiles-accent hover:text-white transition-all duration-300 shadow-md disabled:opacity-50 mt-2"
            >
            {loading ? 'Creando cuenta...' : 'Registrarme'}
            </button>
      </form>

      <div className="mt-5 text-center border-t border-gray-100 pt-5">
        <p className="text-sm text-gray-600">
          ¿Ya tenés una cuenta?{' '}
          <button
            onClick={onSwitch}
            className="text-aquiles-accent font-bold hover:underline transition-all"
          >
            Iniciá sesión acá
          </button>
        </p>
      </div>
    </div>
  );
};