import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, User, MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const mockAd = {
  id: "1",
  title: "iPhone 15 Pro Max 256GB - Comme neuf",
  price: 12500,
  description: "iPhone 15 Pro Max en excellent état, utilisé seulement 3 mois. Batterie à 98%. Vendu avec boîte d'origine, chargeur et coque de protection. Couleur Titane Naturel. Aucune rayure.",
  city: "Casablanca",
  date: "Aujourd'hui",
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
  ],
  seller: { name: "Ahmed M.", joined: "Membre depuis 2024" },
};

const AdDetails = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6 max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>

          <div className="grid md:grid-cols-[1fr_360px] gap-6">
            {/* Images */}
            <div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img src={mockAd.images[currentImage]} alt={mockAd.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 mt-3">
                {mockAd.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === currentImage ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <p className="text-2xl font-heading font-bold text-primary">{mockAd.price.toLocaleString()} DH</p>
                <h1 className="text-lg font-semibold mt-2">{mockAd.title}</h1>
                <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{mockAd.city}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{mockAd.date}</span>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold h-12 gap-2">
                    <MessageCircle className="h-5 w-5" /> Contacter
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mockAd.description}</p>
              </div>

              {/* Seller */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <h3 className="font-heading font-semibold mb-3">Vendeur</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{mockAd.seller.name}</p>
                    <p className="text-xs text-muted-foreground">{mockAd.seller.joined}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdDetails;
