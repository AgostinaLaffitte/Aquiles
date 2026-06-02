import { ProductCard } from './ProductCard';
import type { Product } from '../types/product';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Necesitarás estos iconos

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Estado para abrir/cerrar filtro en móvil

  const categories = ['Todos', ...Array.from(new Set(
    products.flatMap(p => p.categories?.map(c => c.name) || [])
  ))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCat === 'Todos' || 
      product.categories?.some(c => c.name === selectedCat);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

 return (
    // Quitamos el padding excesivo del contenedor principal para que el grid tome control
    <div className="container mx-auto px-4 py-8">
      
      {/* Esto asegura que el layout sea columna en mobile y dos columnas en desktop */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ASIDE - ANCHO FIJO EN DESKTOP */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden w-full bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center font-bold text-sm mb-4"
          >
            Filtrar por categoría {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* ESTE DIV ES LA COLUMNA IZQUIERDA */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24`}>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-4">Categorías</h3>
            
            <input 
              type="text" 
              placeholder="Buscar categoría..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm mb-4 outline-none"
            />

            <ul className="space-y-1">
              {categories.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(cat => (
                <li 
                  key={cat} 
                  onClick={() => setSelectedCat(cat)}
                  className={`text-sm font-bold cursor-pointer px-4 py-3 rounded-xl transition-all ${selectedCat === cat ? 'bg-aquiles-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* GRILLA DE PRODUCTOS - OCUPA EL RESTO DEL ESPACIO */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-slate-400 col-span-full text-center py-20">No se encontraron productos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};