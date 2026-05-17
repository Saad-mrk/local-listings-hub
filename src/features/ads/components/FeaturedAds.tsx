import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDefaultAds } from "@/data";

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès"];

const featuredAds = getDefaultAds()
  .slice(0, 4)
  .map((ad, i) => ({
    id: ad.id,
    title: ad.title,
    price: `${ad.price.toLocaleString()} DH`,
    location: CITIES[i % CITIES.length],
    image: ad.images[0],
    category: ad.category,
    isNew: i % 2 === 0,
  }));

const FeaturedAds = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % featuredAds.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + featuredAds.length) % featuredAds.length);
  const toggleLike = (id: number) =>
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const current = featuredAds[currentIndex];

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold">{t("featured_ads")}</h2>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden bg-card shadow-lg"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={current.image}
                    alt={current.title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {current.isNew && (
                    <Badge className="absolute top-4 left-4 bg-primary">{t("new")}</Badge>
                  )}
                  <motion.button
                    onClick={() => toggleLike(current.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      className={`h-5 w-5 ${liked.includes(current.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </motion.button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{current.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{current.location}</span>
                    </div>
                    <Badge variant="outline">{current.category}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">{current.price}</p>
                  <Link to={`/ad/${current.id}`} className="block w-full">
                    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-semibold">
                      {t("view_ad")}
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            {featuredAds.map((ad, idx) => (
              <motion.button
                key={ad.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full rounded-xl overflow-hidden transition-all ${idx === currentIndex ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  loading="lazy"
                  className="w-full h-24 object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAds;
