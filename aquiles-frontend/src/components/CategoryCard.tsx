interface CategoryCardProps {
  name: string;
  image: string;
}

export const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    // Agregamos p-2 y bg-white para dar efecto de "marco blanco"
    <div className="group relative bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col p-3 h-full">
      
      {/* Contenedor de imagen con altura fija mayor */}
      <div className="h-64 rounded-2xl overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Nombre: con el grupo activo sube */}
      <div className="p-4 flex items-center justify-center bg-white transition-all duration-300 group-hover:-translate-y-1">
        <h4 className="text-center font-black text-slate-800 text-lg uppercase tracking-tight group-hover:text-aquiles-primary transition-colors">
          {name}
        </h4>
      </div>
    </div>
  );
};