import {
  Car,
  Home,
  Smartphone,
  Monitor,
  Sofa,
  Shirt,
  Briefcase,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const categories = [
  { name: "Véhicules", icon: Car, count: 12340, trend: true },
  { name: "Immobilier", icon: Home, count: 8920 },
  { name: "Téléphones", icon: Smartphone, count: 15670, trend: true },
  { name: "Informatique", icon: Monitor, count: 6780 },
  { name: "Maison", icon: Sofa, count: 9430 },
  { name: "Mode", icon: Shirt, count: 11200, trend: true },
  { name: "Emploi", icon: Briefcase, count: 4560 },
  { name: "Sports", icon: Dumbbell, count: 3210 },
];

// Animated counter component
const AnimatedCounter = ({
  target,
  isTrending,
}: {
  target: number;
  isTrending?: boolean;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {isTrending && (
        <Sparkles className="inline-block w-3 h-3 ml-1 text-yellow-500 animate-bounce" />
      )}
    </span>
  );
};

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-xl font-heading font-bold mb-5">
          Catégories populaires
        </h2>
        <motion.div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl bg-secondary/5 hover:bg-secondary/15 border border-secondary/15 hover:border-secondary/30 transition-all duration-200 snap-start group cursor-pointer relative"
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Badge "Nouveau" pour les tendances */}
              {cat.trend && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Tendance
                </motion.div>
              )}

              <motion.div
                className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center group-hover:bg-secondary/25 transition-colors"
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                <cat.icon className="h-6 w-6 text-secondary group-hover:text-primary transition-colors" />
              </motion.div>

              <span className="text-sm font-semibold text-foreground">
                {cat.name}
              </span>

              {/* Animated counter */}
              <motion.span
                className="text-xs text-muted-foreground font-semibold"
                initial={{ color: "var(--muted-foreground)" }}
              >
                <AnimatedCounter target={cat.count} isTrending={cat.trend} />
              </motion.span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
