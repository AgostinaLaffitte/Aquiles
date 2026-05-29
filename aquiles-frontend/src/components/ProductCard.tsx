// src/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { getProductTotalStock, formatPrice } from '../utils/productUtils';
import type { Product } from '../types/product';

export const ProductCard = ({ product }: { product: Product }) => {
  const stock = getProductTotalStock(product);

  return (
    <Link 
      to={`/productos/${product.id}`} 
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full p-2"
    >
      <div className="relative h-64 overflow-hidden rounded-xl bg-slate-50">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-aquiles-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-2xl font-black text-aquiles-accent mt-auto pt-4">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};