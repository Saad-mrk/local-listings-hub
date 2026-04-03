import { Link } from "react-router-dom";

const navCategories = [
  { name: "Véhicules", href: "/category/vehicules" },
  { name: "Immobilier", href: "/category/immobilier" },
  { name: "Téléphones", href: "/category/telephones" },
  { name: "Informatique", href: "/category/informatique" },
  { name: "Mode", href: "/category/mode" },
  { name: "Maison", href: "/category/maison" },
  { name: "Sports", href: "/category/sports" },
  { name: "Emploi", href: "/category/emploi" },
  { name: "Tendances", href: "/category/tendances", highlight: true },
];

const CategoryNav = () => {
  return (
    <div className="border-b border-secondary/30 bg-background">
      <div className="container">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          {navCategories.map((cat) => (
            <Link
              key={cat.name}
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
