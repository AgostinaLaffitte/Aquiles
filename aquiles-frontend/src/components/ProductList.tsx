import { ProductCard } from './ProductCard';
import type { Product } from '../types/product';
import { useState } from 'react';
interface ProductListProps {
  products: Product[];
}
export const ProductList = ({ products }: ProductListProps) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todos');

  // 1. Extraer categorías únicas de forma dinámica desde los productos recibidos
  const categories = ['Todos', ...Array.from(new Set(
    products.flatMap(p => p.categories?.map(c => c.name) || [])
  ))];
  
  // 2. Lógica de filtrado
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCat === 'Todos' || 
      product.categories?.some(c => c.name === selectedCat);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-4">Filtrar Categorías</h3>
          
          <input 
            type="text" 
            placeholder="Buscar categoría..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm mb-6 outline-none focus:ring-2 focus:ring-aquiles-primary/20"
          />

          <ul className="space-y-1">
            {categories.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(cat => (
              <li 
                key={cat} 
                onClick={() => setSelectedCat(cat)}
                className={`text-sm font-bold cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between
                  ${selectedCat === cat 
                    ? 'bg-aquiles-primary text-white shadow-md shadow-aquiles-primary/30' 
                    : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
                {selectedCat === cat && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 3. Mapear los productos filtrados, no el array original */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-slate-400 text-sm italic">No se encontraron productos en esta categoría.</p>
          )}
        </div>
      </div>
    </div>
  );
};