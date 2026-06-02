
import type { Category } from '../../types/category';

interface GeneralInfoProps {
  isEditMode?: boolean;
  productId: string;
  setProductId?: (val: string) => void; // Solo requerido en Create
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categoriesList: Category[];
}

export const GeneralInfoSection = ({
  isEditMode = false,
  productId,
  setProductId,
  name,
  setName,
  price,
  setPrice,
  description,
  setDescription,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
}: GeneralInfoProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
        {isEditMode ? 'Editar Información General' : 'Información General'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
            Código Único {isEditMode ? '(No editable)' : '*'}
          </label>
         <input
          type="number"
          required={!isEditMode}
          disabled={isEditMode}
          placeholder="Ej: 4001"
          value={productId}
          onChange={(e) => setProductId?.(e.target.value)}
          // CORRECCIÓN: Usamos backticks para que las condiciones se unan bien
          className={`w-full border rounded-xl py-3 px-4 outline-none text-base sm:text-sm font-semibold transition-all ${
            isEditMode 
              ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed' 
              : 'border-slate-200 focus:border-slate-400'
          }`}
        />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Nombre del Artículo *</label>
          <input
            type="text"
            required
            placeholder="Ej: Termo de Acero Inoxidable 1L"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-slate-400 text-base sm:text-sm font-semibold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Precio Base ($) *</label>
          <input
            type="number"
            required
            step="0.01"
            placeholder="Ej: 18500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-slate-400 text-base sm:text-sm font-semibold text-slate-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Rubro / Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-3 bg-white outline-none focus:border-slate-400 text-sm font-semibold text-slate-700"
          >
            <option value="">Seleccionar rubro...</option>
            {categoriesList.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Especificaciones / Descripción</label>
        <textarea
          rows={3}
          placeholder="Detalles del producto (origen, dimensiones, materiales)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-slate-200 rounded-xl py-2.5 px-3 outline-none focus:border-slate-400 text-sm font-medium text-slate-600"
        />
      </div>
    </div>
  );
};