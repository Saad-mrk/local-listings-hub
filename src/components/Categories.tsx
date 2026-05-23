import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  Users,
  Baby,
  Home,
  Smartphone,
  Activity,
  Sparkles,
  LayoutGrid,
  Shirt,
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

// Fallback local categories (used if API is unreachable)
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    nom: "Femmes",
    children: [
      { id: 11, nom: "Vêtements" },
      { id: 12, nom: "Chaussures" },
      { id: 13, nom: "Sacs" },
      { id: 14, nom: "Accessoires" },
      { id: 15, nom: "Bijoux & montres" },
    ],
  },
  {
    id: 2,
    nom: "Hommes",
    children: [
      { id: 21, nom: "T-shirts & Polos" },
      { id: 22, nom: "Vestes & Manteaux" },
      { id: 23, nom: "Chaussures" },
      { id: 24, nom: "Casquettes" },
      { id: 25, nom: "Accessoires" },
    ],
  },
  {
    id: 3,
    nom: "Enfants",
    children: [
      { id: 31, nom: "Vêtements bébé" },
      { id: 32, nom: "Vêtements enfant" },
      { id: 33, nom: "Jouets" },
      { id: 34, nom: "Chaussures" },
    ],
  },
  {
    id: 4,
    nom: "Maison",
    children: [
      { id: 41, nom: "Décoration" },
      { id: 42, nom: "Cuisine" },
      { id: 43, nom: "Meubles" },
      { id: 44, nom: "Linge de maison" },
    ],
  },
  {
    id: 5,
    nom: "Électronique",
    children: [
      { id: 51, nom: "Smartphones" },
      { id: 52, nom: "Ordinateurs" },
      { id: 53, nom: "Audio & Casques" },
      { id: 54, nom: "Accessoires" },
    ],
  },
  {
    id: 6,
    nom: "Sport",
    children: [
      { id: 61, nom: "Vêtements sport" },
      { id: 62, nom: "Chaussures sport" },
      { id: 63, nom: "Équipement" },
      { id: 64, nom: "Fitness" },
    ],
  },
];

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("femme")) return User;
  if (n.includes("homme")) return Users;
  if (n.includes("enfant")) return Baby;
  if (n.includes("maison")) return Home;
  if (n.includes("électro") || n.includes("electro")) return Smartphone;
  if (n.includes("sport")) return Activity;
  if (n.includes("vêt") || n.includes("vet")) return Shirt;
  return LayoutGrid;
};

const Categories = ({ onFilter }: CategoriesProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<Category[]>("https://localhost:7111/api/Categorie/tree", {
        signal: controller.signal,
        timeout: 3000,
      })
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
        }
      })
      .catch(() => {
        // Silencieux: on garde le fallback local
      });
    return () => controller.abort();
  }, []);

  // Fermer au clic à l'extérieur
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = (id: number) => {
    setActiveCategory((cur) => (cur === id ? null : id));
  };

  const handleSelection = (catId?: number, subId?: number, label = "") => {
    onFilter({ categoryId: catId, subCategoryId: subId, label });
    setActiveCategory(null);
  };

  return (
    <div className="bg-background border-b border-border w-full">
      <div className="container">
        <div
          ref={containerRef}
          className="flex items-center gap-1 h-12 overflow-x-auto no-scrollbar"
        >
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.nom);
            const isActive = activeCategory === cat.id;
            const isHot = ["Femmes", "Hommes", "Électronique"].includes(cat.nom);

            return (
              <div key={cat.id} className="relative h-full flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(cat.nom)}</span>
                  {isHot && (
                    <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-bold leading-none">
                      HOT
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-60 transition-transform ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-72 bg-popover text-popover-foreground border border-border shadow-2xl rounded-xl py-2 z-[999] mt-1"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelection(cat.id, undefined, cat.nom)}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 flex justify-between items-center"
                      >
                        <span>
                          {t("Voir tout")} {t(cat.nom)}
                        </span>
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>

                      {cat.children && cat.children.length > 0 && (
                        <>
                          <div className="h-px bg-border my-1 mx-2" />
                          <div className="max-h-[320px] overflow-y-auto py-1">
                            {cat.children.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() =>
                                  handleSelection(undefined, sub.id, sub.nom)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                {t(sub.nom)}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
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
