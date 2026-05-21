import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Category {
  id: number;
  nom: string;
  children?: Category[];
}

interface CategorySelectorProps {
  onSelect: (categoryId: number, categoryName: string) => void;
  selectedId?: number;
}

const CategorySelector = ({ onSelect, selectedId }: CategorySelectorProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<Category[]>("https://localhost:7111/api/Categorie/tree");

        // Vérifier que la réponse est un tableau valide
        if (!Array.isArray(response.data)) {
          throw new Error(
            `Invalid API response format. Expected array, got ${typeof response.data}. ` +
              `Response: ${JSON.stringify(response.data).substring(0, 100)}`,
          );
        }

        // Vérifier que le tableau n'est pas vide (optionnel, mais recommandé)
        if (response.data.length === 0) {
          console.warn("Warning: API returned an empty categories array");
        }

        setCategories(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load categories from API";

        console.error("Error fetching categories:", {
          error: err,
          message: errorMessage,
          timestamp: new Date().toISOString(),
        });

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectParent = (category: Category) => {
    if (!category.children || category.children.length === 0) {
      onSelect(category.id, category.nom);
      setSelectedParent(null);
      setIsOpen(false);
      return;
    }

    setSelectedParent(category);
  };

  const handleSelectChild = (child: Category) => {
    onSelect(child.id, child.nom);
    setSelectedParent(null);
    setIsOpen(false);
  };

  const handleGoBack = () => {
    setSelectedParent(null);
  };

  const selectedCategory = categories
    .flatMap((cat) => [cat, ...(cat.children ?? [])])
    .find((cat) => cat.id === selectedId);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setSelectedParent(null);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-foreground">{t("category")}</span>
          <span className="flex items-center gap-2 min-w-0">
            <span className="truncate text-muted-foreground">
              {selectedCategory ? t(selectedCategory.nom) : t("Sélectionne une catégorie")}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 z-50 bg-white border border-border rounded-xl shadow-xl p-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {t("error")}: {error}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {selectedParent ? (
                  <motion.div
                    key="subcategories"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={handleGoBack}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-4 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("back")}
                    </button>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                        {t("subcategories")}
                      </h3>
                      {selectedParent.children && selectedParent.children.length > 0 ? (
                        selectedParent.children.map((child) => (
                          <motion.button
                            key={child.id}
                            onClick={() => handleSelectChild(child)}
                            whileHover={{ x: 4 }}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                              selectedId === child.id
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "bg-muted/50 text-foreground hover:bg-muted"
                            }`}
                          >
                            {t(child.nom)}
                          </motion.button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-4">
                          {t("no_subcategories")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                        {t("categories")}
                      </h3>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <motion.button
                            key={cat.id}
                            onClick={() => handleSelectParent(cat)}
                            whileHover={{ x: 4 }}
                            className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                          >
                            <span>{t(cat.nom)}</span>
                            {cat.children && cat.children.length > 0 && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                {cat.children.length}
                              </span>
                            )}
                          </motion.button>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground py-4">{t("no_categories")}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySelector;
