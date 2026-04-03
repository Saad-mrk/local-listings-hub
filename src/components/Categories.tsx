import { Car, Home, Smartphone, Monitor, Sofa, Shirt, Briefcase, Dumbbell } from "lucide-react";
import { useRef } from "react";

const categories = [
  { name: "Véhicules", icon: Car, count: 12340 },
  { name: "Immobilier", icon: Home, count: 8920 },
  { name: "Téléphones", icon: Smartphone, count: 15670 },
  { name: "Informatique", icon: Monitor, count: 6780 },
  { name: "Maison", icon: Sofa, count: 9430 },
  { name: "Mode", icon: Shirt, count: 11200 },
  { name: "Emploi", icon: Briefcase, count: 4560 },
  { name: "Sports", icon: Dumbbell, count: 3210 },
];

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-xl font-heading font-bold mb-5">Catégories populaires</h2>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl bg-muted/60 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 snap-start group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <cat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
