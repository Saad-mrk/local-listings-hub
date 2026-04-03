import AdCard from "./AdCard";
import { motion } from "framer-motion";

const mockAds = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB - Comme neuf",
    price: 12500,
    city: "Casablanca",
    image: "https://picsum.photos/600/450?random=5",
    date: "Aujourd'hui",
  },
  {
    id: "2",
    title: "Appartement 3 chambres - Hay Riad",
    price: 850000,
    city: "Rabat",
    image: "https://picsum.photos/600/450?random=6",
    date: "Hier",
  },
  {
    id: "3",
    title: "Mercedes Classe C 220d - 2021",
    price: 295000,
    city: "Marrakech",
    image: "https://picsum.photos/600/450?random=7",
    date: "Hier",
  },
  {
    id: "4",
    title: "MacBook Pro M2 14 pouces",
    price: 18000,
    city: "Fès",
    image: "https://picsum.photos/600/450?random=8",
    date: "Il y a 2 jours",
  },
  {
    id: "5",
    title: "Canapé moderne en cuir - Excellent état",
    price: 4500,
    city: "Tanger",
    image: "https://picsum.photos/600/450?random=9",
    date: "Il y a 3 jours",
  },
  {
    id: "6",
    title: "Samsung Galaxy S24 Ultra",
    price: 9800,
    city: "Agadir",
    image: "https://picsum.photos/600/450?random=10",
    date: "Il y a 3 jours",
  },
  {
    id: "7",
    title: "Vélo électrique pliable - Neuf",
    price: 3200,
    city: "Casablanca",
    image: "https://picsum.photos/600/450?random=11",
    date: "Il y a 4 jours",
  },
  {
    id: "8",
    title: "Table à manger en bois massif",
    price: 2800,
    city: "Rabat",
    image: "https://picsum.photos/600/450?random=12",
    date: "Il y a 5 jours",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const AdsGrid = () => {
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
          <motion.button
            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            whileHover={{ x: 5 }}
          >
            Voir tout →
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mockAds.map((ad) => (
            <motion.div key={ad.id} variants={itemVariants}>
              <AdCard {...ad} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AdsGrid;
