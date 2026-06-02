// src/components/Hero.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import type { Banner } from '../types/banner';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // <-- Importamos flechas custom

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroProps {
  offers: Banner[];
}

export const Hero = ({ offers }: HeroProps) => {
  return (
    // Ajuste de altura: 250px en móvil, 500px en escritorio
    <section className="w-full h-[250px] md:h-[500px] bg-slate-100 shadow-inner overflow-hidden relative group/hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.hero-swiper-button-next',
          prevEl: '.hero-swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={offers.length > 1}
        className="h-full"
      >
        {offers.map((banner) => {
          const slideContent = (
            <div className="w-full h-full relative group cursor-pointer">
              <img 
                src={banner.imageUrl} 
                alt={banner.title || "Banner Aquiles"} 
                className="w-full h-full object-cover"
              />
              
              {banner.title && (
                // Ajuste de posición y tamaño para móvil
                <div className="absolute bottom-6 left-4 md:bottom-12 md:left-12 bg-white/95 p-4 md:p-7 rounded-2xl shadow-xl max-w-[240px] md:max-w-md border border-slate-100/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <h2 className="text-lg md:text-3xl font-black uppercase text-slate-900 tracking-tight italic leading-tight">
                    {banner.title}
                  </h2>
                  {banner.link && (
                    <span className="mt-2 md:mt-4 inline-flex h-8 md:h-9 items-center justify-center bg-slate-950 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest px-4 md:px-5 rounded-lg md:rounded-xl">
                      VER MÁS
                    </span>
                  )}
                </div>
              )}
            </div>
          );

          return (
            <SwiperSlide key={banner.id}>
              {banner.link ? (
                <Link to={banner.link} className="block w-full h-full">
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* FLECHAS: Ocultas en móvil para no ensuciar la imagen, visibles en md */}
      {offers.length > 1 && (
        <div className="hidden md:flex">
          <button className="hero-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-md hover:bg-white transition-all opacity-0 group-hover/hero:opacity-100">
            <ChevronLeft size={22} />
          </button>
          <button className="hero-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-md hover:bg-white transition-all opacity-0 group-hover/hero:opacity-100">
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
};