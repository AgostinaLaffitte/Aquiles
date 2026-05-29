// src/pages/Faq.tsx
import { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingBag, Truck, CreditCard, RefreshCw, ArrowRight } from 'lucide-react';

interface FaqItem {
  id: number;
  category: 'compra' | 'envio' | 'pago' | 'cambios';
  question: string;
  answer: string;
}

export const Faq = () => {
  // Estado para saber qué pregunta está abierta (guarda el ID, o null si están todas cerradas)
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'compra',
      question: '¿Cómo realizo una compra en la tienda?',
      answer: 'Es súper fácil: navegás por nuestro catálogo, elegís los productos con sus respectivas variantes (diseño, aromas, colores) y los agregás al carrito. Una vez listo, hacés click en "Finalizar Compra", completás tus datos de contacto, seleccionás el método de entrega y te dirige con tu orden a whatsapp de nuestro negocio, donde coordinas el pago con nosotros para una compra segura y personalizada.'
    },
    {
      id: 2,
      category: 'compra',
      question: '¿Tienen compra mínima o precios mayoristas?',
      answer: 'NO hay compra mínimo de compra, pero SI Contamos con un sistema mayorista automatizado directo en el carrito. Al alcanzar el monto mínimo de compra mayorista, el sistema te aplicará automáticamente un descuento sobre el total de tus productos antes de pagar. '
    },
    {
      id: 3,
      category: 'envio',
      question: '¿Cuáles son los métodos de envío y entrega?',
      answer: 'Ofrecemos dos modalidades: 1) Retiro sin cargo por nuestro Local. 2) Envío a domicilio a coordinar: realizamos entregas y despachos; el costo del mismo se acuerda con nosotros de forma privada una vez registrado el pedido.'
    },
    {
      id: 4,
      category: 'envio',
      question: '¿Cuánto demora en estar listo mi pedido?',
      answer: 'Los pedidos con retiro local suelen armarse dentro de las 24/48 horas hábiles. Para envíos a domicilio o despachos, el tiempo de preparación e inicio del viaje dependerá de factores, pero al hacer el pedido se le informa un tiempo estimado, lo cual te notificaremos por WhatsApp.'
    },
    {
      id: 5,
      category: 'pago',
      question: '¿Qué medios de pago aceptan?',
      answer: 'Podés abonar de manera 100% segura mediante Mercado Pago, utilizando dinero en cuenta o tarjetas de débito y crédito de cualquier entidad bancaria (Visa, Mastercard, Cabal, etc.).'
    },
    {
      id: 6,
      category: 'cambios',
      question: '¿Los productos tienen cambio?',
      answer: 'Sí, realizamos cambios por fallas de fábrica o por variantes dentro de los 15 días posteriores a la recepción de la compra, siempre y cuando el producto se encuentre en perfectas condiciones, sin uso y en su empaque original. Comunicate con nuestro soporte para coordinarlo.'
    }
  ];

  // Helper para renderizar iconos lindos según la categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'compra': return <ShoppingBag size={18} className="text-slate-400" />;
      case 'envio': return <Truck size={18} className="text-slate-400" />;
      case 'pago': return <CreditCard size={18} className="text-slate-400" />;
      default: return <RefreshCw size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Encabezado Principal */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <HelpCircle size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
            Centro de Ayuda
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium max-w-md mx-auto">
            Encontrá respuestas rápidas a las dudas más comunes sobre tus compras, envíos y medios de pago en Aquiles.
          </p>
        </div>

        {/* Listado de Acordeones */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Botón de la Pregunta */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group select-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <span className="font-bold text-slate-800 text-sm md:text-base group-hover:text-slate-950 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`}
                  />
                </button>

                {/* Contenedor Animado de la Respuesta */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 border-t border-slate-50' : 'max-h-0'}`}
                >
                  <div className="p-5 md:p-6 bg-slate-50/50 text-sm text-slate-600 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Footer de Ayuda */}
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[24px] mt-12 text-center shadow-md space-y-4">
          <h3 className="text-lg font-black uppercase italic tracking-tight">
            ¿Todavía tenés alguna duda?
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
            Si no encontraste lo que buscabas, no te preocupes. Escribinos directo por WhatsApp y te ayudamos en minutos.
          </p>
          <div className="pt-2">
            <a 
              href="https://wa.me/2284269809" // Pone acá el celu real de tu cliente o el tuyo para probar
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 bg-white text-slate-950 font-black px-6 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
            >
              Contactar por WhatsApp
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};