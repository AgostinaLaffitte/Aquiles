
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusBannerProps {
  type: 'success' | 'error' | null;
  message: string;
}

export const StatusBanner = ({ type, message }: StatusBannerProps) => {
  if (!type) return null;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
      type === 'success' 
        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
        : 'bg-rose-50 border-rose-100 text-rose-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
      ) : (
        <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
      )}
      <div className="text-xs font-semibold">{message}</div>
    </div>
  );
};