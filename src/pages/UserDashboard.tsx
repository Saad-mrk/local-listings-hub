import { useState, useEffect } from "react";
import {
  Heart,
  Package,
  MessageCircle,
  User,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StarRating from "@/components/StarRating";

const mockMyAds = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 12500,
    city: "Casablanca",
    date: "Aujourd'hui",
    views: 45,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=200&fit=crop",
    status: "active",
  },
  {
    id: "2",
    title: 'MacBook Pro M3 14"',
    price: 22000,
    city: "Rabat",
    date: "Hier",
    views: 32,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop",
    status: "active",
  },
  {
    id: "3",
    title: "AirPods Pro 2",
    price: 2800,
    city: "Marrakech",
    date: "Il y a 3 jours",
    views: 18,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=200&fit=crop",
    status: "sold",
  },
];

const mockFavorites = [
  {
    id: "4",
    title: "Samsung Galaxy S24 Ultra",
    price: 14000,
    city: "Tanger",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=200&fit=crop",
  },
  {
    id: "5",
    title: "PlayStation 5 + 2 Manettes",
    price: 5500,
    city: "Fès",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop",
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "Youssef K.",
    lastMessage: "Est-ce que le prix est négociable ?",
    time: "Il y a 5 min",
    unread: true,
    avatar: "Y",
  },
  {
    id: "2",
    sender: "Fatima Z.",
    lastMessage: "Je suis intéressée, on peut se rencontrer ?",
    time: "Il y a 1h",
    unread: true,
    avatar: "F",
  },
  {
    id: "3",
    sender: "Omar B.",
    lastMessage: "Merci pour la réponse !",
    time: "Hier",
    unread: false,
    avatar: "O",
  },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("ads");
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.id).getFullYear();

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
        <div className="container py-8 max-w-5xl">
          {/* Profile header */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="h-10 w-10 text-secondary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-heading font-bold">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <StarRating rating={4.5} size="sm" showCount count={23} />
                  <span className="text-xs text-muted-foreground">
                    • Membre depuis {memberSince}
                  </span>
                </div>
              </div>
              <Link to="/settings">
                <Button
                  variant="outline"
                  className="rounded-xl border-secondary/30 gap-2"
                >
                  <Edit className="h-4 w-4" /> Modifier
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted rounded-xl p-1 mb-6">
              <TabsTrigger
                value="ads"
                className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Package className="h-4 w-4" /> Mes annonces
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Heart className="h-4 w-4" /> Favoris
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <MessageCircle className="h-4 w-4" /> Messages
              </TabsTrigger>
            </TabsList>

            {/* My Ads */}
            <TabsContent value="ads">
              <div className="space-y-3">
                {mockMyAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-card rounded-2xl border border-border p-4 shadow-card flex items-center gap-4"
                  >
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-24 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">
                          {ad.title}
                        </h3>
                        {ad.status === "sold" && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                            Vendu
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-bold text-sm mt-0.5">
                        {ad.price.toLocaleString()} DH
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ad.city} • {ad.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" /> {ad.views}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Favorites */}
            <TabsContent value="favorites">
              <div className="grid sm:grid-cols-2 gap-4">
                {mockFavorites.map((ad) => (
                  <Link
                    key={ad.id}
                    to={`/ad/${ad.id}`}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-sm">{ad.title}</h3>
                      <p className="text-primary font-bold mt-1">
                        {ad.price.toLocaleString()} DH
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ad.city}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages">
              <div className="space-y-2">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-card rounded-2xl border p-4 flex items-center gap-4 cursor-pointer hover:shadow-card transition-shadow ${msg.unread ? "border-primary/30" : "border-border"}`}
                  >
                    <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm shrink-0">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm ${msg.unread ? "font-bold" : "font-medium"}`}
                        >
                          {msg.sender}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate mt-0.5 ${msg.unread ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {msg.lastMessage}
                      </p>
                    </div>
                    {msg.unread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default UserDashboard;
