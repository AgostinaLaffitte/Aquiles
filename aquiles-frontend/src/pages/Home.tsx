// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { ProductService } from '../services/product.service';
import { BannerService } from '../services/banner.service';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import type { Banner } from '../types/banner';
import type { Product } from '../types/product';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, productData] = await Promise.all([
          BannerService.getAll(),
          ProductService.getAll()
        ]);
        setBanners(bannerData);
        setProducts(productData);
      } catch (error) {
        console.error("Error cargando la Home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mapeo dinámico de categorías basado en los productos existentes
  const categoriesMap = new Map<number, { id: number; name: string; image: string }>();

  products.forEach(product => {
    product.categories?.forEach(cat => {
      if (!categoriesMap.has(cat.id)) {
        categoriesMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          image: product.images?.[0] || '' 
        });
      }
    });
  });

  const categories = Array.from(categoriesMap.values());

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-black uppercase text-aquiles-secondary italic tracking-wider animate-pulse">
        Cargando Aquiles...
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* SECCIÓN HERO DINÁMICA CON SWIPER SLIDER */}
      {banners.length > 0 ? (
        <Hero offers={banners} />
      ) : (
        <section className="w-full h-[300px] bg-slate-900 flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">
          Bienvenidos a Aquiles Tienda
        </section>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic">
            Nuestras Secciones
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">
            Explorá el catálogo por tipo de producto
          </p>
        </div>
        
              {/* grid-cols-2: En móviles (default) muestra 2 columnas.
          md:grid-cols-4: En escritorio (md+) muestra 4 columnas.
          gap-4: Espacio pequeño en móvil para no perder espacio.
          md:gap-8: Espacio grande en escritorio.
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/productos?category=${cat.id}`}
              className="block h-full"
            >
              <CategoryCard name={cat.name} image={cat.image} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};