import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    id: 1,
    name: "Mohammed Ali",
    role: "Vendeur de voitures",
    image: "https://picsum.photos/100/100?random=13",
    text: "LBAL a transformé mon business. J'ai vendu plus de 50 voitures en 6 mois!",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatima Ben",
    role: "Acheteuse régulière",
    image: "https://picsum.photos/100/100?random=14",
    text: "Interface intuitive et transactions sécurisées. Très satisfaite!",
    rating: 5,
  },
  {
    id: 3,
    name: "Hassan Rachid",
    role: "Agent immobilier",
    image: "https://picsum.photos/100/100?random=15",
    text: "Plateforme fiable avec une excellente visibilité. Recommandé!",
    rating: 4,
  },
];

const Testimonials = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const current = testimonials[currentIndex];

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          {t("testimonials_title")}
        </h2>
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 shadow-lg border border-secondary/20 text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array(current.rating)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    </motion.div>
                  ))}
              </div>
              <p className="text-lg text-foreground mb-8 italic">"{current.text}"</p>
              <div className="flex items-center justify-center gap-4">
                <motion.img
                  src={current.image}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="text-left">
                  <p className="font-semibold text-foreground">{current.name}</p>
                  <p className="text-sm text-muted-foreground">{current.role}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === currentIndex ? "bg-primary w-6" : "bg-secondary/30 w-2"}`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={prev}
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={next}
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
