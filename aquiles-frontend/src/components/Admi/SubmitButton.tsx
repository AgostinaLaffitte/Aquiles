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
    className="h-11 px-6 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider shadow-md flex items-center gap-2 disabled:opacity-50"
  >
    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
    {isLoading ? loadingText : text}
  </button>
);