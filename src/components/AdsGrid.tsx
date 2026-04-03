import AdCard from "./AdCard";

const mockAds = [
  { id: "1", title: "iPhone 15 Pro Max 256GB - Comme neuf", price: 12500, city: "Casablanca", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=450&fit=crop", date: "Aujourd'hui" },
  { id: "2", title: "Appartement 3 chambres - Hay Riad", price: 850000, city: "Rabat", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop", date: "Hier" },
  { id: "3", title: "Mercedes Classe C 220d - 2021", price: 295000, city: "Marrakech", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=450&fit=crop", date: "Hier" },
  { id: "4", title: "MacBook Pro M2 14 pouces", price: 18000, city: "Fès", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=450&fit=crop", date: "Il y a 2 jours" },
  { id: "5", title: "Canapé moderne en cuir - Excellent état", price: 4500, city: "Tanger", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop", date: "Il y a 3 jours" },
  { id: "6", title: "Samsung Galaxy S24 Ultra", price: 9800, city: "Agadir", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=450&fit=crop", date: "Il y a 3 jours" },
  { id: "7", title: "Vélo électrique pliable - Neuf", price: 3200, city: "Casablanca", image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=450&fit=crop", date: "Il y a 4 jours" },
  { id: "8", title: "Table à manger en bois massif", price: 2800, city: "Rabat", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=450&fit=crop", date: "Il y a 5 jours" },
];

const AdsGrid = () => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading font-bold">Annonces récentes</h2>
          <button className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
            Voir tout →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockAds.map((ad) => (
            <AdCard key={ad.id} {...ad} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdsGrid;
