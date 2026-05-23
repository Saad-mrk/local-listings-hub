import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  User,
  Users,
  Baby,
  Home,
  Smartphone,
  Activity,
  Sparkles,
  LayoutGrid,
  Shirt,
  Footprints,
  Watch,
  Grid3X3,
  Package,
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

const getSubCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("vêt") || n.includes("vet") || n.includes("shirt") || n.includes("t-shirt")) return Shirt;
  if (n.includes("chauss")) return Footprints;
  if (n.includes("access") || n.includes("bijoux") || n.includes("montre")) return Watch;
  if (n.includes("sac")) return Package;
  if (n.includes("soin")) return Sparkles;
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
    <div className="relative z-40 bg-background border-b border-border w-full">
      <div ref={containerRef} className="container relative">
        <div className="flex items-center gap-8 h-14 overflow-visible whitespace-nowrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <div key={cat.id} className="h-full flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`relative h-full px-1 text-base font-medium transition-colors ${
                    isActive
                      ? "text-foreground after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t(cat.nom)}</span>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full z-[999] min-h-[320px] bg-popover text-popover-foreground border-t border-border shadow-2xl"
                    >
                      <div className="container py-7">
                        <div className="w-full max-w-sm space-y-1">
                          <button
                            type="button"
                            onClick={() => handleSelection(cat.id, undefined, cat.nom)}
                            className="group flex w-full items-center gap-4 px-3 py-2.5 text-left text-lg font-medium text-muted-foreground hover:text-primary"
                          >
                            <Grid3X3 className="h-6 w-6 text-primary" />
                            <span>{t("Voir tout")}</span>
                          </button>

                          {cat.children?.map((sub, index) => {
                            const SubIcon = getSubCategoryIcon(sub.nom);
                            const hasChildren = Boolean(sub.children?.length);

                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleSelection(undefined, sub.id, sub.nom)}
                                className={`group flex w-full items-center gap-4 px-3 py-2.5 text-left text-lg transition-colors hover:text-primary ${
                                  index === 0
                                    ? "font-bold text-foreground"
                                    : "font-medium text-muted-foreground"
                                }`}
                              >
                                <SubIcon className="h-6 w-6 text-primary" />
                                <span className="flex-1">{t(sub.nom)}</span>
                                {hasChildren && (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                )}
                              </button>
                            );
                          })}
                        </div>
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
