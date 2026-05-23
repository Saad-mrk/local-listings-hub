import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Loader,
  User,
  Users,
  Baby,
  Home,
  Smartphone,
  Activity,
  Tag,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Category {
  id: number;
  nom: string;
  children?: Category[];
}

interface CategoriesProps {
  onFilter: (filters: { categoryId?: number; subCategoryId?: number; label: string }) => void;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("femme")) return User;
  if (n.includes("homme")) return Users;
  if (n.includes("enfant")) return Baby;
  if (n.includes("maison")) return Home;
  if (n.includes("électro")) return Smartphone;
  if (n.includes("sport")) return Activity;
  return LayoutGrid;
};

const Categories = ({ onFilter }: CategoriesProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("https://localhost:7111/api/Categorie/tree");
        setCategories(response.data);
      } catch (err) {
        console.error("Erreur API", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading)
    return (
      <div className="h-12 flex items-center justify-center">
        <Loader className="animate-spin h-5 w-5 text-primary" />
      </div>
    );

  return (
    <div className="bg-background border-b border-border w-full">
      <div className="container">
        {/* IMPORTANT: Ne pas mettre overflow-hidden ici sinon le menu sera coupé */}
        <div className="flex items-center gap-6 h-12 overflow-x-auto scrollbar-hide no-scrollbar">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.nom);
            const isHot = ["Femmes", "Hommes", "Électronique"].includes(cat.nom);

            return (
              <div
                key={cat.id}
                className="relative h-full flex items-center shrink-0"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-1 text-sm font-medium transition-colors h-full border-b-2 ${
                    activeCategory === cat.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(cat.nom)}</span>
                  {isHot && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-sm font-bold leading-none">
                      HOT
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3 w-3 opacity-50 transition-transform ${activeCategory === cat.id ? "rotate-180" : ""}`}
                  />
                </button>

                {/* MENU DÉROULANT */}
                <AnimatePresence>
                  {activeCategory === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      // z-index très élevé et position absolue
                      className="absolute top-full left-0 w-64 bg-white dark:bg-slate-900 border border-border shadow-xl rounded-b-lg py-2 z-[999] mt-[-1px]"
                    >
                      <button
                        onClick={() => {
                          onFilter({ categoryId: cat.id, label: cat.nom });
                          setActiveCategory(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex justify-between items-center"
                      >
                        {t("Voir tout")} {t(cat.nom)}
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>

                      <div className="h-[1px] bg-border my-1 mx-2" />

                      <div className="max-h-[300px] overflow-y-auto">
                        {cat.children?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onFilter({ subCategoryId: sub.id, label: sub.nom });
                              setActiveCategory(null);
                            }}
                            className="w-full text-left px-4 py-2 text-[13.5px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          >
                            {t(sub.nom)}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
