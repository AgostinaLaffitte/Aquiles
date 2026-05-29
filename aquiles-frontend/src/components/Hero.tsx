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
    <section className="w-full h-[380px] md:h-[500px] bg-slate-100 shadow-inner overflow-hidden relative group/hero">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        // Configuramos la navegación vinculándola a nuestras clases personalizadas
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
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              />
              
              {banner.title && (
                <div className="absolute bottom-12 left-4 md:left-12 bg-white/95 p-5 md:p-7 rounded-[24px] shadow-xl max-w-sm md:max-w-md border border-slate-100/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <h2 className="text-xl md:text-2xl font-black uppercase text-aquiles-neutral tracking-tight italic leading-tight">
                    {banner.title}
                  </h2>
                  {banner.link && (
                    <span className="mt-4 inline-flex h-9 items-center justify-center bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest px-5 rounded-xl group-hover:bg-aquiles-accent transition-all">
                      DESCUBRIR SECCIÓN
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

      {/* FLECHAS DE NAVEGACIÓN PERSONALIZADAS */}
      {offers.length > 1 && (
        <>
          <button className="hero-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-aquiles-neutral shadow-md hover:bg-white hover:scale-105 transition-all md:opacity-0 group-hover/hero:opacity-100">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button className="hero-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-aquiles-neutral shadow-md hover:bg-white hover:scale-105 transition-all md:opacity-0 group-hover/hero:opacity-100">
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </>
      )}
    </section>
  );
};