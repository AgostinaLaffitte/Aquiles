import { Layers, Plus, Trash2 } from 'lucide-react';

export interface LocalVariant {
  id?: number; // Para variantes preexistentes en edición
  name: string;
  stock: number;
  price: number | null;
}

interface VariantMatrixProps {
  variants: LocalVariant[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onVariantChange: (index: number, field: keyof LocalVariant, value: any) => void;
}

export const VariantMatrix = ({
  variants,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
}: VariantMatrixProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-slate-400" /> Matriz de Variantes
        </h3>
        <button
          type="button"
          onClick={onAddVariant}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
        >
          <Plus size={14} /> Añadir Variante
        </button>
      </div>

      <p className="text-[11px] text-slate-400">
        Cargá variantes específicas si el artículo cambia por modelo, color o talle. Si no definís un precio especial, heredará el base.
      </p>

      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
            <div className="w-full sm:flex-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Nombre de la Variante</label>
              <input
                type="text"
                placeholder="Ej: Azul Francia / Rojo / Mediano"
                value={variant.name}
                onChange={(e) => onVariantChange(index, 'name', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
            
            <div className="w-full sm:w-28">
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Stock Físico</label>
              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) => onVariantChange(index, 'stock', +e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold outline-none focus:border-slate-400 text-center"
              />
            </div>

            <div className="w-full sm:w-36">
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Precio Variante (Opcional)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Usa base"
                value={variant.price || ''}
                onChange={(e) => onVariantChange(index, 'price', e.target.value ? +e.target.value : null)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-black text-slate-700 outline-none focus:border-slate-400"
              />
            </div>

            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveVariant(index)}
                className="text-slate-400 hover:text-red-500 p-2 sm:mt-4 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};