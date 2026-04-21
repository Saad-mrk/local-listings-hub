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
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import NotificationDropdown from "./NotificationDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import Categories from "./Categories";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved === "dark" || (!saved && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.div>
      </Button>
    </motion.div>
  );
};

const Navbar = () => {
  const { user, logout } = useUser();
  const { totalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchType, setSearchType] = React.useState<"ads" | "members">("members");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const searchPlaceholder =
    searchType === "members" ? t("search_members_placeholder") : t("search_ads_placeholder");

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
            <div className="flex w-full h-10 rounded-xl bg-muted border border-secondary/20 overflow-hidden focus-within:ring-2 focus-within:ring-secondary/40 transition-shadow">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-full px-4 text-sm font-medium text-foreground border-r border-secondary/20 hover:bg-background/40 transition-colors flex items-center gap-1.5"
                  >
                    {searchType === "members" ? t("search_type_members") : t("search_type_ads")}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => setSearchType("ads")}>
                    {t("search_type_ads")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchType("members")}>
                    {t("search_type_members")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="w-full h-full pl-10 pr-4 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <DarkModeToggle />
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
                        aria-label={t("cart")}
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
                <TooltipContent>{t("cart")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/favorites" className="hidden sm:flex">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("favorites")}
                        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t("favorites")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/messages" className="hidden sm:flex">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("messages")}
                        className="text-muted-foreground hover:text-primary hover:bg-secondary/10"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t("messages")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link to="/create">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl gap-2 font-semibold">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("publish")}</span>
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
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
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
                    <TooltipContent>{t("dashboard")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
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
                    <DropdownMenuItem disabled className="font-semibold text-sm">
                      {t("hello")}, {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">
                    <User className="mr-2 h-4 w-4" />
                    {t("login")}
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
