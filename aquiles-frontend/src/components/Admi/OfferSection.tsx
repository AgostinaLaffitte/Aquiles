
interface OfferSectionProps {
  isOffer: boolean;
  setIsOffer: (value: boolean) => void;
  offerPrice: string;
  setOfferPrice: (value: string) => void;
}

export const OfferSection = ({ 
  isOffer, 
  setIsOffer, 
  offerPrice, 
  setOfferPrice 
}: OfferSectionProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
        Promociones
      </h3>
      
      <label className="flex items-center gap-3 cursor-pointer p-1">
        <input
          type="checkbox"
          checked={isOffer}
          onChange={(e) => setIsOffer(e.target.checked)}
          className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
        />
        <span className="text-xs font-bold text-slate-700 uppercase">
          Activar precio de liquidación
        </span>
      </label>

      {isOffer && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-[11px] font-bold text-slate-400 uppercase">
            Precio Promocional ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 15000"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-3 outline-none focus:border-slate-400 text-sm font-black text-red-500 bg-red-50/20"
          />
        </div>
      )}
    </div>
  );
};