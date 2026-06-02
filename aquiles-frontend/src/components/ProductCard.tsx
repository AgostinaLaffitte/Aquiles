// src/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/productUtils';
import type { Product } from '../types/product';

export const ProductCard = ({ product }: { product: Product }) => {

  return (
    <Link 
      to={`/productos/${product.id}`} 
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full p-2"
    >
      {/* CAMBIO: h-48 en móvil, h-64 en escritorio */}
      <div className="relative h-48 md:h-64 overflow-hidden rounded-xl bg-slate-50">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>
        {/* Ajuste de tamaño de precio para que no se vea gigante en móvil */}
        <p className="text-xl md:text-2xl font-black text-slate-950 mt-auto pt-4">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};