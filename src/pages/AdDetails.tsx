import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, User, MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import Comments from "@/components/Comments";
import { useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useNotification } from "@/hooks/useNotification";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDefaultAds, getAdById } from "@/data";

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];
const SELLERS = [
  { name: "Ahmed M.", joined: "Membre depuis 2024", rating: 4.5, reviewCount: 23 },
  { name: "Fatima B.", joined: "Membre depuis 2023", rating: 4.8, reviewCount: 45 },
  { name: "Hassan R.", joined: "Membre depuis 2022", rating: 4.9, reviewCount: 67 },
  { name: "Mohammed K.", joined: "Membre depuis 2024", rating: 4.6, reviewCount: 12 },
  { name: "Sarah D.", joined: "Membre depuis 2023", rating: 4.7, reviewCount: 34 },
  { name: "Nadia L.", joined: "Membre depuis 2024", rating: 4.4, reviewCount: 18 },
];

const AdDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const all = getDefaultAds();
  const ad = (id && getAdById(id)) || all[0];
  const idx = all.findIndex((a) => a.id === ad.id);
  const seller = SELLERS[idx % SELLERS.length];
  const mockAd = {
    ...ad,
    city: CITIES[idx % CITIES.length],
    date: "Aujourd'hui",
    seller,
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
      <main className="flex-1">
        <div className="container py-6 max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Link>

          <div className="grid md:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-6">
              <div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-secondary/20">
                  <img
                    src={mockAd.images[currentImage]}
                    alt={mockAd.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {mockAd.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === currentImage ? "border-primary" : "border-secondary/20"}`}
                    >
                      <img
                        src={img}
                        alt={`${mockAd.title} aperçu ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Comments />
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <p className="text-2xl font-heading font-bold text-primary">
                  {mockAd.price.toLocaleString()} DH
                </p>
                <h1 className="text-lg font-semibold mt-2">{mockAd.title}</h1>
                <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-secondary" />
                    {mockAd.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-secondary" />
                    {mockAd.date}
                  </span>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold h-12 gap-2">
                    <MessageCircle className="h-5 w-5" /> {t("contact_seller")}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-secondary/30 hover:bg-secondary/10"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-secondary/30 hover:bg-secondary/10"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold mb-2">{t("description")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockAd.description}
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold mb-3">{t("seller")}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{mockAd.seller.name}</p>
                    <StarRating
                      rating={mockAd.seller.rating}
                      size="sm"
                      showCount
                      count={mockAd.seller.reviewCount}
                    />
                    <p className="text-xs text-muted-foreground mt-0.5">{mockAd.seller.joined}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default AdDetails;
