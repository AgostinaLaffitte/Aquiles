// src/components/Admin/SubmitButton.tsx
import { Save, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export const SubmitButton = ({ isLoading, text, loadingText }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    // Añadimos 'w-full' para móvil y 'sm:w-auto' para escritorio
    // Añadimos 'text-sm' en móvil para mejorar legibilidad
    className="w-full sm:w-auto h-12 px-8 bg-slate-900 text-white font-black text-sm sm:text-xs rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
  >
    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
    {isLoading ? loadingText : text}
  </button>
);