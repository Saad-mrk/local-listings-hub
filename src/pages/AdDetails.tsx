import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, User, MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import Comments from "@/components/Comments";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const allAds = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB - Comme neuf",
    price: 12500,
    description:
      "iPhone 15 Pro Max en excellent état, utilisé seulement 3 mois. Batterie à 98%. Vendu avec boîte d'origine, chargeur et coque de protection. Couleur Titane Naturel. Aucune rayure.",
    city: "Casablanca",
    date: "Aujourd'hui",
    images: [
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.15 AM.jpeg",
      "https://picsum.photos/800/600?random=2",
    ],
    seller: { name: "Ahmed M.", joined: "Membre depuis 2024", rating: 4.5, reviewCount: 23 },
  },
  {
    id: "2",
    title: "Appartement 3 chambres - Hay Riad",
    price: 850000,
    description:
      "Magnifique appartement 3 chambres, 2 salles de bain, salon spacieux. Entièrement rénové. Accès à la piscine et parking.",
    city: "Rabat",
    date: "Hier",
    images: [
      "https://picsum.photos/800/600?random=3",
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.16 AM.jpeg",
    ],
    seller: { name: "Fatima B.", joined: "Membre depuis 2023", rating: 4.8, reviewCount: 45 },
  },
  {
    id: "3",
    title: "Mercedes Classe C 220d - 2021",
    price: 295000,
    description:
      "Mercedes Classe C 220d 2021, 45 000 km, excellent état. Cuir chauffant, toit panoramique, système audio premium.",
    city: "Marrakech",
    date: "Hier",
    images: [
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.17 AM (1).jpeg",
      "https://picsum.photos/800/600?random=6",
    ],
    seller: { name: "Hassan R.", joined: "Membre depuis 2022", rating: 4.9, reviewCount: 67 },
  },
  {
    id: "4",
    title: "MacBook Pro M3 Max",
    price: 22500,
    description:
      "MacBook Pro 16 pouces M3 Max, 16GB RAM, 512GB SSD. Garantie 1 an. État neuf, jamais utilisé.",
    city: "Fès",
    date: "Il y a 2 jours",
    images: [
      "https://picsum.photos/800/600?random=7",
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.17 AM (2).jpeg",
    ],
    seller: { name: "Mohammed K.", joined: "Membre depuis 2024", rating: 4.6, reviewCount: 12 },
  },
  {
    id: "5",
    title: "Montre de luxe - Rolex Submariner",
    price: 45000,
    description:
      "Montre Rolex Submariner authentique, 2023. Avec tous les documents et garantie. État impeccable, très peu utilisée.",
    city: "Casablanca",
    date: "Aujourd'hui",
    images: [
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.17 AM (3).jpeg",
      "https://picsum.photos/800/600?random=9",
    ],
    seller: { name: "Sarah D.", joined: "Membre depuis 2023", rating: 4.7, reviewCount: 34 },
  },
  {
    id: "6",
    title: "Sac à main de marque - Authentic",
    price: 3500,
    description:
      "Sac à main de marque, authentique avec certificat d'authenticité. Jamais utilisé, avec emballage d'origine.",
    city: "Marrakech",
    date: "Il y a 2 jours",
    images: [
      "https://picsum.photos/800/600?random=11",
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.17 AM (4).jpeg",
    ],
    seller: { name: "Nadia L.", joined: "Membre depuis 2024", rating: 4.4, reviewCount: 18 },
  },
  {
    id: "7",
    title: "Chaussures de sport Nike - Neuf",
    price: 1200,
    description:
      "Chaussures de sport Nike dernière collection. Taille 42. Jamais portées, avec boîte d'origine.",
    city: "Fès",
    date: "Il y a 1 jour",
    images: [
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.17 AM.jpeg",
      "https://picsum.photos/800/600?random=13",
    ],
    seller: { name: "Karim B.", joined: "Membre depuis 2022", rating: 4.8, reviewCount: 56 },
  },
  {
    id: "8",
    title: "Caméra DSLR Canon 5D Mark IV",
    price: 8500,
    description:
      "Caméra DSLR professionnelle Canon 5D Mark IV. En excellent état, avec accessoires. Parfait pour photographes.",
    city: "Rabat",
    date: "Il y a 3 jours",
    images: [
      "https://picsum.photos/800/600?random=14",
      "/img_lbal/WhatsApp Image 2026-05-17 at 12.22.18 AM (1).jpeg",
    ],
    seller: { name: "Laurent P.", joined: "Membre depuis 2021", rating: 4.9, reviewCount: 89 },
  },
];

const AdDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const mockAd = allAds.find((ad) => ad.id === id) || allAds[0];

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
