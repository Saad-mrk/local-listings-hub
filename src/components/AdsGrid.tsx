import { useState, useMemo } from "react";
import AdCard from "./AdCard";
import FilterSidebar, { type Filters } from "./FilterSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockAds = [
  { id: "1", title: "iPhone 15 Pro Max 256GB - Comme neuf", price: 12500, city: "Casablanca", image: "https://picsum.photos/600/450?random=5", date: "Aujourd'hui", category: "Électronique" },
  { id: "2", title: "Appartement 3 chambres - Hay Riad", price: 850000, city: "Rabat", image: "https://picsum.photos/600/450?random=6", date: "Hier", category: "Immobilier" },
  { id: "3", title: "Mercedes Classe C 220d - 2021", price: 295000, city: "Marrakech", image: "https://picsum.photos/600/450?random=7", date: "Hier", category: "Véhicules" },
  { id: "4", title: "MacBook Pro M2 14 pouces", price: 18000, city: "Fès", image: "https://picsum.photos/600/450?random=8", date: "Il y a 2 jours", category: "Électronique" },
  { id: "5", title: "Canapé moderne en cuir - Excellent état", price: 4500, city: "Tanger", image: "https://picsum.photos/600/450?random=9", date: "Il y a 3 jours", category: "Mobilier" },
  { id: "6", title: "Samsung Galaxy S24 Ultra", price: 9800, city: "Agadir", image: "https://picsum.photos/600/450?random=10", date: "Il y a 3 jours", category: "Électronique" },
  { id: "7", title: "Vélo électrique pliable - Neuf", price: 3200, city: "Casablanca", image: "https://picsum.photos/600/450?random=11", date: "Il y a 4 jours", category: "Sports" },
  { id: "8", title: "Table à manger en bois massif", price: 2800, city: "Rabat", image: "https://picsum.photos/600/450?random=12", date: "Il y a 5 jours", category: "Mobilier" },
];

const defaultFilters: Filters = {
  priceRange: [0, 1000000],
  categories: [],
  cities: [],
  dateFrom: undefined,
  dateTo: undefined,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AdsGrid = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    count += filters.categories.length;
    count += filters.cities.length;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  const filteredAds = useMemo(() => {
    return mockAds.filter((ad) => {
      if (ad.price < filters.priceRange[0] || ad.price > filters.priceRange[1]) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(ad.category)) return false;
      if (filters.cities.length > 0 && !filters.cities.includes(ad.city)) return false;
      return true;
    });
  }, [filters]);

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
      chips.push({
        label: `${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} DH`,
        onRemove: () => setFilters((f) => ({ ...f, priceRange: [0, 1000000] })),
      });
    }
    filters.categories.forEach((cat) =>
      chips.push({
        label: cat,
        onRemove: () => setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== cat) })),
      })
    );
    filters.cities.forEach((city) =>
      chips.push({
        label: city,
        onRemove: () => setFilters((f) => ({ ...f, cities: f.cities.filter((c) => c !== city) })),
      })
    );
    return chips;
  }, [filters]);

  return (
    <section className="py-8">
      <div className="container">
        <motion.div
          className="flex items-center justify-between mb-5"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-heading font-bold">Annonces récentes</h2>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="text-xs px-1.5 py-0 ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </motion.div>
            <motion.button
              className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              whileHover={{ x: 5 }}
            >
              Voir tout →
            </motion.button>
          </div>
        </motion.div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {activeChips.map((chip) => (
                <motion.span
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full border border-border"
                >
                  {chip.label}
                  <button onClick={chip.onRemove} className="ml-1 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilters(defaultFilters)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Tout effacer
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredAds.length > 0 ? (
                <motion.div
                  key="grid"
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredAds.map((ad) => (
                    <motion.div key={ad.id} variants={itemVariants} layout>
                      <AdCard {...ad} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground text-lg mb-2">Aucune annonce trouvée</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                    Réinitialiser les filtres
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdsGrid;
