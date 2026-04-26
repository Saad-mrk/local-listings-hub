import { Search, MapPin, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

const HeroSearch = () => {
  const { t } = useLanguage();
  const [displayedText, setDisplayedText] = useState("");
  const fullText = t("hero_title");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-secondary/5 to-transparent relative overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="container max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="font-heading font-extrabold tracking-widest text-primary text-7xl md:text-9xl mb-6 animate-pulse"
          variants={itemVariants}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        >
          LBAL
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight mb-3 h-[60px] md:h-[70px] flex items-center justify-center"
          variants={itemVariants}
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </motion.h1>

        <motion.p className="text-muted-foreground text-lg mb-8" variants={itemVariants}>
          {t("hero_subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-stretch gap-3 bg-card rounded-2xl p-2 shadow-card border border-secondary/20"
          variants={itemVariants}
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary group-hover:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t("hero_search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/50 border border-secondary/15 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all hover:border-secondary/30"
            />
            {searchQuery && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-secondary/20 rounded-xl shadow-lg p-2 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-xs text-muted-foreground px-2 py-1">
                  {t("popular_suggestions")}
                </p>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/10 rounded-lg transition-colors">
                  {searchQuery} à Casablanca
                </button>
              </motion.div>
            )}
          </div>

          <div className="relative flex-1 sm:max-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
            <select className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted/50 border border-secondary/15 text-sm text-muted-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer transition-all hover:border-secondary/30">
              <option value="">{t("all_cities")}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <Button className="h-12 px-8 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold text-base transition-all hover:shadow-lg">
            <Search className="h-5 w-5 mr-2" />
            {t("search")}
          </Button>

          <motion.button
            className="h-12 px-4 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/15 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t("voice_search")}
          >
            <Mic className="h-5 w-5 text-secondary" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSearch;
