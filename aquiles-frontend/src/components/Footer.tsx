import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { Camera as Instagram, MessageCircle as Facebook } from 'lucide-react';
import fondoMarca from '../assets/fondo-footer.png';
import logoAquiles from '../assets/logoAquiles.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
   <footer className="relative w-full bg-slate-950 text-white border-t border-slate-900 mt-auto bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${fondoMarca})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 to-slate-950/90 z-0"></div>
      
      <div className="relative z-10 w-full">
        {/* Barra superior: CAMBIO A GRID-COLS-1 EN MOBILE */}
        <div className="border-b border-slate-900/60 w-full">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: ShoppingBag, title: "Descuento", text: "15% OFF mayorista" },
                { icon: Truck, title: "Envíos", text: "Retiro o despacho" },
                { icon: ShieldCheck, title: "Seguridad", text: "Pago 100% seguro" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 justify-center sm:justify-start">
                  <div className="w-10 h-10 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center text-slate-200"><item.icon size={20} /></div>
                  <div><h4 className="text-[10px] font-black uppercase text-slate-100">{item.title}</h4><p className="text-[10px] text-slate-400">{item.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Contenido principal del footer */}
       <div className="container mx-auto px-6 py-10 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Info Marca */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <img src={logoAquiles} alt="Aquiles" className="h-10 object-contain" />
              <p className="text-xs text-slate-400 max-w-xs">Tu polirrubro de confianza. Todo lo que buscás en regalería, juguetería, librería y mucho más.</p>
            </div>

            {/* Explorar */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 inline-block md:block">Explorar</h4>
              <ul className="space-y-3 text-xs font-bold">
                <li><Link to="/productos" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Catálogo</Link></li>
                <li><Link to="/ayuda" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Preguntas Frecuentes</Link></li>
                <li><Link to="/carrito" className="text-slate-300 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Mi Carrito</Link></li>
              </ul>
            </div>

            {/* Contacto */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 inline-block md:block">
              Contacto
            </h4>
            <ul className="space-y-3 text-xs text-slate-300 w-full flex flex-col items-center md:items-start">
              
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-slate-500 shrink-0" /> 
                <span>Vicente López 3028, Olavarría</span>
              </li>

              <li className="group">
                <a href="https://wa.me/5492284269809" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 transition-colors duration-200 group-hover:text-white">
                  <Phone size={14} className="text-slate-500 shrink-0 group-hover:text-emerald-400 transition-colors" /> 
                  WhatsApp
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
           <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black uppercase text-slate-400 border-b border-slate-800 pb-2 inline-block md:block">
              Medios de Pago
            </h4>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-black uppercase w-fit">
                Transferencia
              </span>
              <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-black uppercase w-fit">
                Tarjetas
              </span>
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