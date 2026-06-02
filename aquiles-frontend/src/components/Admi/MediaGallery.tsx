
import { Image as ImageIcon, Plus, X } from 'lucide-react';

interface MediaGalleryProps {
  existingImages?: string[]; // Opcional, solo usado en Update
  onRemoveExisting?: (url: string) => void; // Opcional, solo usado en Update
  previewUrls: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNew: (index: number) => void;
}

// ... (imports iguales)

export const MediaGallery = ({ existingImages = [],
  onRemoveExisting,
  previewUrls,
  onImageChange,
  onRemoveNew,
}: MediaGalleryProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
        <ImageIcon size={16} className="text-slate-400" /> Galería Multimedia
      </h3>

      {/* 1. SECCIÓN: IMÁGENES EXISTENTES */}
      {existingImages.length > 0 && onRemoveExisting && (
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Imágenes Actuales</span>
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                <img src={url} alt="Guardada" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ZONA DROP/UPLOAD */}
      <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-slate-400 hover:bg-slate-50/50 transition-all text-center">
        <input type="file" multiple accept="image/*" onChange={onImageChange} className="hidden" />
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
          <Plus size={24} />
        </div>
        <span className="text-xs font-bold text-slate-700">
          {existingImages.length > 0 ? 'Agregar nuevas' : 'Subir imágenes'}
        </span>
      </label>

      {/* 3. SECCIÓN: NUEVAS PREVISUALIZACIONES */}
      {previewUrls.length > 0 && (
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-slate-400 uppercase">Nuevas a subir</span>
          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => onRemoveNew(idx)} 
                  // AQUÍ EL CAMBIO: Siempre visible en móvil (opacity-100), 
                  // escondido en escritorio hasta pasar el mouse (md:opacity-0 md:group-hover:opacity-100)
                  className="absolute top-1 right-1 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};