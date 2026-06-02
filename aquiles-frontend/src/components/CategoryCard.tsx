interface CategoryCardProps {
  name: string;
  image: string;
}
export const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    // Ajuste de padding y bordes para móvil
    <div className="group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col p-2 h-full">
      
      {/* CAMBIO: h-40 en móvil (más compacto) 
        h-64 solo en pantallas md (tablets/PC) 
      */}
      <div className="h-40 md:h-64 rounded-xl overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Ajuste de padding de texto para mejor lectura en móviles */}
      <div className="p-3 md:p-4 flex items-center justify-center bg-white transition-all duration-300 group-hover:-translate-y-1">
        <h4 className="text-center font-black text-slate-800 text-sm md:text-lg uppercase tracking-tight group-hover:text-yellow-600 transition-colors">
          {name}
        </h4>
      </div>
    </div>
  );
};