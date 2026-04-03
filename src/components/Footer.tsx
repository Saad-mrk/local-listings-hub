import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/40 mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-heading font-extrabold text-primary">LBAL</span>
            <p className="text-sm text-muted-foreground mt-2">
              La marketplace #1 au Maroc. Achetez et vendez facilement.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Catégories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Véhicules</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Immobilier</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Téléphones</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Informatique</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Centre d'aide</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Sécurité</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Carrières</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2026 LBAL. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
