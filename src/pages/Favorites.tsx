import { useState } from "react";
import {
  Heart,
  MapPin,
  Clock,
  Search,
  Grid3X3,
  List,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockFavorites = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 12500,
    city: "Casablanca",
    date: "Aujourd'hui",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    category: "Téléphones",
  },
  {
    id: "2",
    title: 'MacBook Pro M3 14"',
    price: 22000,
    city: "Rabat",
    date: "Hier",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "Informatique",
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra",
    price: 14000,
    city: "Tanger",
    date: "Il y a 2 jours",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    category: "Téléphones",
  },
  {
    id: "4",
    title: "PlayStation 5 + 2 Manettes",
    price: 5500,
    city: "Fès",
    date: "Il y a 3 jours",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
    category: "Jeux & Consoles",
  },
  {
    id: "5",
    title: "Appartement 3 chambres Guéliz",
    price: 850000,
    city: "Marrakech",
    date: "Il y a 5 jours",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    category: "Immobilier",
  },
  {
    id: "6",
    title: "Vélo électrique Xiaomi",
    price: 8500,
    city: "Casablanca",
    date: "Il y a 1 semaine",
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
    category: "Véhicules",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.25 },
  },
};

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState(mockFavorites);

  const filtered = favorites.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => prev.filter((f) => f.id !== id));
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
              Mes Favoris
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {favorites.length} annonces sauvegardées
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-lg h-8 w-8",
                viewMode === "grid" && "bg-card shadow-sm",
              )}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-lg h-8 w-8",
                viewMode === "list" && "bg-card shadow-sm",
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-muted border-secondary/20"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun favori trouvé</p>
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
                  <p className="text-primary font-bold mt-1">
                    {ad.price.toLocaleString()} DH
                  </p>
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
                  className="w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">
                      {ad.title}
                    </h3>
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
