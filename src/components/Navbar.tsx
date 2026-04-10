import {
  Search,
  Plus,
  User,
  Heart,
  MessageCircle,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import NotificationDropdown from "./NotificationDropdown";
import Categories from "./Categories";

const Navbar = () => {
  const { user, logout } = useUser();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <nav className="border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-heading font-extrabold tracking-tight text-primary">
              LBAL
            </span>
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
            <NotificationDropdown />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/cart" className="hidden sm:flex">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                      {totalItems > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          {totalItems}
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Panier</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/favorites" className="hidden sm:flex">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Mes favoris</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/messages" className="hidden sm:flex">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Messages</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/create">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl gap-2 font-semibold">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Publier</span>
                </Button>
              </Link>
            </motion.div>

            {/* Conditional buttons based on login status */}
            {user ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/dashboard">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-secondary/30 hover:bg-secondary/10"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Tableau de bord</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-secondary/30 hover:bg-secondary/10"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled
                      className="font-semibold text-sm"
                    >
                      Bonjour, {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">
                    <User className="mr-2 h-4 w-4" />
                    Se connecter
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
      <Categories />
    </header>
  );
};

export default Navbar;
