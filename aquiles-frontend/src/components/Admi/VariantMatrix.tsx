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
          <Plus size={14} /> Añadir
        </button>
      </div>

      <p className="text-[11px] text-slate-400">
        Cargá variantes específicas si el artículo cambia por modelo, color o talle.
      </p>

    <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            
            {/* Fila superior: Nombre y Botón Eliminar */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Azul Francia"
                  value={variant.name}
                  onChange={(e) => onVariantChange(index, 'name', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 text-sm font-semibold outline-none focus:border-slate-400"
                />
              </div>
              
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="mt-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Fila inferior: Stock y Precio (Grid 50/50) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => onVariantChange(index, 'stock', +e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 text-sm font-bold outline-none focus:border-slate-400 text-center"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={variant.price || ''}
                  onChange={(e) => onVariantChange(index, 'price', e.target.value ? +e.target.value : null)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 text-sm font-black text-slate-700 outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};