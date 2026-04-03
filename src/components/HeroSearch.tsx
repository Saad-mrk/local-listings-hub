import { Search, MapPin, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];
const categories = ["Véhicules", "Immobilier", "Téléphones", "Informatique", "Maison", "Mode"];

const HeroSearch = () => {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight mb-3">
          Trouvez tout près de chez vous
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Achetez et vendez facilement partout au Maroc
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-card rounded-2xl p-2 shadow-card border border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Que cherchez-vous ?"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/50 text-sm text-muted-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Button className="h-12 px-8 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold text-base">
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
