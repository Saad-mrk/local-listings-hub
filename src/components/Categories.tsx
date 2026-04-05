import {
  User,
  Users,
  Baby,
  Crown,
  Activity,
  Sparkles,
  TrendingUp,
  Tag,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const categories = [
  {
    name: "Women",
    icon: User,
    count: 28450,
    color: "#FF69B4",
    bgColor: "from-pink-50 to-rose-50",
  },
  {
    name: "Men",
    icon: Users,
    count: 19860,
    color: "#4A90E2",
    bgColor: "from-blue-50 to-indigo-50",
  },
  {
    name: "Kids",
    icon: Baby,
    count: 15340,
    color: "#FFD700",
    bgColor: "from-yellow-50 to-amber-50",
  },
  {
    name: "Brands",
    icon: Crown,
    count: 8920,
    trend: true,
    color: "#E67E22",
    bgColor: "from-orange-50 to-amber-50",
  },
  {
    name: "Sports",
    icon: Activity,
    count: 12670,
    color: "#27AE60",
    bgColor: "from-green-50 to-emerald-50",
  },
  {
    name: "Trending",
    icon: TrendingUp,
    count: 34200,
    trend: true,
    color: "#E91E63",
    bgColor: "from-red-50 to-pink-50",
  },
  {
    name: "Sale",
    icon: Tag,
    count: 9540,
    trend: true,
    color: "#FF0000",
    bgColor: "from-red-50 to-rose-50",
  },
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
    <section className="py-4 border-t border-border bg-background">
      <div className="container">
        <motion.div
          className="flex gap-8 items-center overflow-x-auto pb-2 scrollbar-hide"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              variants={itemVariants}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-2 font-semibold transition-all relative group ${
                cat.name === "Sale"
                  ? "text-destructive font-bold text-lg"
                  : cat.trend
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Icône */}
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <cat.icon className="h-5 w-5" />
              </motion.div>

              {/* Texte */}
              <span>{cat.name}</span>

              {/* Indicateur tendance */}
              {cat.trend && cat.name !== "Sale" && (
                <motion.span
                  className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  HOT
                </motion.span>
              )}

              {/* Underline au hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary-hover"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
