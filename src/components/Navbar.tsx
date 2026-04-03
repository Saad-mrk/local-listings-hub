import { Search, Plus, User, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CategoryNav from "./CategoryNav";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <nav className="border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-heading font-extrabold tracking-tight text-primary">LBAL</span>
          </Link>

          {/* Mini search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher sur LBAL..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border border-secondary/20 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-shadow"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/favorites" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-secondary/10">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/messages" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-secondary/10">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/create">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl gap-2 font-semibold">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Publier</span>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="icon" className="rounded-xl border-secondary/30 hover:bg-secondary/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <CategoryNav />
    </header>
  );
};

export default Navbar;
