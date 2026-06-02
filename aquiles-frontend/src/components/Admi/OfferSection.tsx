
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
      
      {/* Aumentamos el padding del label para que el área de clic sea más grande en móvil */}
      <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
        <input
          type="checkbox"
          checked={isOffer}
          onChange={(e) => setIsOffer(e.target.checked)}
          // Aumentamos ligeramente el tamaño del checkbox para facilitar el toque
          className="w-5 h-5 rounded text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"
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
            // Ajuste a text-base en móvil para evitar zoom de iOS
            className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-slate-400 text-base sm:text-sm font-black text-red-500 bg-red-50/20"
          />
        </div>
      )}
    </div>
  );
};