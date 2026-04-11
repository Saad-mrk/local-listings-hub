import React, { createContext, useContext, useState, useCallback } from "react";

export type Language = "fr" | "en" | "ar";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Navbar
  "search_placeholder": { fr: "Rechercher sur LBAL...", en: "Search on LBAL...", ar: "...البحث في LBAL" },
  "publish": { fr: "Publier", en: "Publish", ar: "نشر" },
  "login": { fr: "Se connecter", en: "Log in", ar: "تسجيل الدخول" },
  "cart": { fr: "Panier", en: "Cart", ar: "السلة" },
  "favorites": { fr: "Mes favoris", en: "My favorites", ar: "المفضلة" },
  "messages": { fr: "Messages", en: "Messages", ar: "الرسائل" },
  "dashboard": { fr: "Tableau de bord", en: "Dashboard", ar: "لوحة التحكم" },
  "profile": { fr: "Profil", en: "Profile", ar: "الملف الشخصي" },
  "settings": { fr: "Paramètres", en: "Settings", ar: "الإعدادات" },
  "logout": { fr: "Se déconnecter", en: "Log out", ar: "تسجيل الخروج" },
  "hello": { fr: "Bonjour", en: "Hello", ar: "مرحبا" },
  // Hero
  "hero_title": { fr: "Trouvez ce que vous cherchez", en: "Find what you're looking for", ar: "ابحث عما تريد" },
  "hero_subtitle": { fr: "Des milliers d'annonces près de chez vous", en: "Thousands of ads near you", ar: "آلاف الإعلانات بالقرب منك" },
  // Categories
  "all": { fr: "Tout", en: "All", ar: "الكل" },
  "vehicles": { fr: "Véhicules", en: "Vehicles", ar: "مركبات" },
  "real_estate": { fr: "Immobilier", en: "Real Estate", ar: "عقارات" },
  "electronics": { fr: "Électronique", en: "Electronics", ar: "إلكترونيات" },
  "fashion": { fr: "Mode", en: "Fashion", ar: "أزياء" },
  "home": { fr: "Maison", en: "Home", ar: "منزل" },
  "services": { fr: "Services", en: "Services", ar: "خدمات" },
  "jobs": { fr: "Emploi", en: "Jobs", ar: "وظائف" },
  "other": { fr: "Autre", en: "Other", ar: "أخرى" },
  // Filter sidebar
  "filters": { fr: "Filtres", en: "Filters", ar: "الفلاتر" },
  "price": { fr: "Prix", en: "Price", ar: "السعر" },
  "category": { fr: "Catégorie", en: "Category", ar: "الفئة" },
  "city": { fr: "Ville", en: "City", ar: "المدينة" },
  "date": { fr: "Date", en: "Date", ar: "التاريخ" },
  "reset_filters": { fr: "Réinitialiser", en: "Reset", ar: "إعادة ضبط" },
  "apply_filters": { fr: "Appliquer", en: "Apply", ar: "تطبيق" },
  // Ads
  "featured_ads": { fr: "Annonces à la une", en: "Featured Ads", ar: "إعلانات مميزة" },
  "all_ads": { fr: "Toutes les annonces", en: "All Ads", ar: "جميع الإعلانات" },
  "no_results": { fr: "Aucun résultat", en: "No results", ar: "لا توجد نتائج" },
  "add_to_cart": { fr: "Ajouter au panier", en: "Add to cart", ar: "أضف إلى السلة" },
  // How it works
  "how_it_works": { fr: "Comment ça marche", en: "How it works", ar: "كيف يعمل" },
  // FAQ
  "faq": { fr: "Questions fréquentes", en: "FAQ", ar: "الأسئلة الشائعة" },
  // Footer
  "about": { fr: "À propos", en: "About", ar: "حول" },
  "contact": { fr: "Contact", en: "Contact", ar: "اتصل بنا" },
  "terms": { fr: "Conditions", en: "Terms", ar: "الشروط" },
  "privacy": { fr: "Confidentialité", en: "Privacy", ar: "الخصوصية" },
  // Notifications
  "notifications": { fr: "Notifications", en: "Notifications", ar: "الإشعارات" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language;
    return saved || "fr";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const dir = language === "ar" ? "rtl" : "ltr";

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
