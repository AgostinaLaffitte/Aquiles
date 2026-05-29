import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Camera as Instagram, MessageCircle as Facebook } from 'lucide-react';
import fondoMarca from '../assets/fondo-footer.png';
import logoAquiles from '../assets/logoAquiles.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative w-full bg-slate-950 text-white border-t border-slate-900 mt-auto bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${fondoMarca})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 to-slate-950/90 z-0"></div>
      
      <div className="relative z-10 w-full">
        {/* Barra superior de beneficios */}
        <div className="border-b border-slate-900/60 w-full">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center text-slate-200 flex-shrink-0"><ShoppingBag size={22} /></div>
                <div><h4 className="text-xs font-black uppercase tracking-wider text-slate-100">Descuento Mayorista</h4><p className="text-xs text-slate-400 mt-0.5">15% OFF al superar el monto mínimo.</p></div>
              </div>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center text-slate-200 flex-shrink-0"><Truck size={22} /></div>
                <div><h4 className="text-xs font-black uppercase tracking-wider text-slate-100">Envíos a Coordinar</h4><p className="text-xs text-slate-400 mt-0.5">Retiro en local o despacho express.</p></div>
              </div>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center text-slate-200 flex-shrink-0"><ShieldCheck size={22} /></div>
                <div><h4 className="text-xs font-black uppercase tracking-wider text-slate-100">Pago Seguro</h4><p className="text-xs text-slate-400 mt-0.5">Aboná con total confianza.</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal del footer */}
        <div className="container mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Info Marca */}
            <div className="space-y-4">
              <img src={logoAquiles} alt="Aquiles" className="h-12 object-contain" />
              <p className="text-xs text-slate-400 leading-relaxed">Tu polirrubro de confianza. Todo lo que buscás en regalería, juguetería, librería, marroquinería y mucho más.</p>
              <div className="space-y-2 pt-2">
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Clock size={13} /> Horarios</h5>
                <p className="text-xs text-slate-400"><span className="font-bold text-white">Local:</span> Lun-Sab 9:00-21:00 / Dom 15:00-21:00</p>
                <p className="text-xs text-slate-400"><span className="font-bold text-white">Web:</span> 24hs</p>
              </div>
            </div>

            {/* Explorar */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">Explorar</h4>
              <ul className="space-y-3 text-xs font-bold">
                <li><Link to="/productos" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Catálogo</Link></li>
                <li><Link to="/ayuda" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Preguntas Frecuentes</Link></li>
                <li><Link to="/carrito" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Mi Carrito</Link></li>
              </ul>
            </div>

            {/* Contacto */}
           <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Contacto
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              {/* Dirección (No es enlace, pero le ponemos un estilo consistente) */}
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-slate-500 shrink-0" /> Vicente López 3028, Olavarría
              </li>

              {/* Enlaces con hover completo */}
              <li className="group">
                <a href="https://wa.me/5492284269809" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 transition-colors duration-200 group-hover:text-white">
                  <Phone size={14} className="text-slate-500 shrink-0 group-hover:text-emerald-400 transition-colors" /> 
                  WhattsApp
                </a>
              </li>

              <li className="group">
                <a href="mailto:paseo.aquiles.centro@gmail.com" 
                  className="flex items-center gap-2.5 transition-colors duration-200 group-hover:text-white">
                  <Mail size={14} className="text-slate-500 shrink-0 group-hover:text-sky-400 transition-colors" /> 
                  Gmail
                </a>
              </li>

              <li className="group">
                <a href="https://www.instagram.com/aquilesolavarria" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 transition-colors duration-200 group-hover:text-white">
                  <Instagram size={14} className="text-slate-500 shrink-0 group-hover:text-pink-500 transition-colors" /> 
                 Instagram
                </a>
              </li>

              <li className="group">
                <a href="https://www.facebook.com/aquiles.olavarria" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 transition-colors duration-200 group-hover:text-white">
                  <Facebook size={14} className="text-slate-500 shrink-0 group-hover:text-blue-500 transition-colors" /> 
                 Facebook
                </a>
              </li>
            </ul>
          </div>

            {/* Medios de Pago */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">Medios de Pago</h4>
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-black uppercase w-fit">Transferencia</span>
                <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-black uppercase w-fit">Tarjetas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright centrado */}
        <div className="border-t border-slate-900/60 w-full py-6 bg-slate-950/40 backdrop-blur-sm">
          <div className="text-center text-[11px] text-slate-500">
            © {currentYear} AQUILES POLIRRUBRO.
          </div>
        </div>
      </div>
    </footer>
  );
};