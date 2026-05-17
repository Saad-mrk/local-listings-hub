import { useState } from "react";
import { Heart, MapPin, Clock, Search, Grid3X3, List, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getAdById } from "@/data";

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { favorites: favIds, removeFavorite: removeFav } = useFavorites();
  const { t } = useLanguage();

  const favorites = favIds
    .map((id, i) => {
      const ad = getAdById(id);
      if (!ad) return null;
      return {
        id: ad.id,
        title: ad.title,
        price: ad.price,
        city: CITIES[i % CITIES.length],
        date: "Aujourd'hui",
        image: ad.images[0],
        category: ad.category,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const filtered = favorites.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFav(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />
      <main className="flex-1 container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              {t("my_favorites")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {favorites.length} {t("saved_ads")}
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-lg h-8 w-8", viewMode === "grid" && "bg-card shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-lg h-8 w-8", viewMode === "list" && "bg-card shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_favorites")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-muted border-secondary/20"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("no_favorites")}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ad) => (
              <Link
                key={ad.id}
                to={`/ad/${ad.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="relative">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    loading="lazy"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => removeFavorite(ad.id, e)}
                    className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                  <span className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full font-medium">
                    {ad.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate">{ad.title}</h3>
                  <p className="text-primary font-bold mt-1">{ad.price.toLocaleString()} DH</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ad.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ad.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ad) => (
              <Link
                key={ad.id}
                to={`/ad/${ad.id}`}
                className="bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  loading="lazy"
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{ad.title}</h3>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      {ad.category}
                    </span>
                  </div>
                  <p className="text-primary font-bold text-sm mt-1">
                    {ad.price.toLocaleString()} DH
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ad.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ad.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => removeFavorite(ad.id, e)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </motion.div>
  );
};

export default Favorites;
