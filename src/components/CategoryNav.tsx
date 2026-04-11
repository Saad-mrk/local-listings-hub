import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CategoryNav = () => {
  const { t } = useLanguage();

  const navCategories = [
    { name: t("cat_vehicles"), href: "/category/vehicules" },
    { name: t("cat_real_estate"), href: "/category/immobilier" },
    { name: t("cat_phones"), href: "/category/telephones" },
    { name: t("cat_computers"), href: "/category/informatique" },
    { name: t("cat_fashion"), href: "/category/mode" },
    { name: t("cat_home"), href: "/category/maison" },
    { name: t("cat_sports"), href: "/category/sports" },
    { name: t("cat_jobs"), href: "/category/emploi" },
    { name: t("cat_trending"), href: "/category/tendances", highlight: true },
  ];

  return (
    <div className="border-b border-secondary/30 bg-background">
      <div className="container">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          {navCategories.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                cat.highlight
                  ? "text-primary hover:bg-primary/10"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary/15"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNav;
