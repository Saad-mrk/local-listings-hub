import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  "Véhicules",
  "Immobilier",
  "Téléphones",
  "Informatique",
  "Maison",
  "Mode",
  "Emploi",
  "Sports",
];
const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

const CreateAd = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newImages].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <div className="container max-w-2xl py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>
        <h1 className="text-2xl font-heading font-bold mb-6">{t("create_ad_title")}</h1>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">{t("photos_max")}</label>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={img}
                    alt={`Photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-background" />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">{t("add_photo")}</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("title")}</label>
            <input
              type="text"
              placeholder={t("title_placeholder")}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("description_label")}</label>
            <textarea
              rows={4}
              placeholder={t("description_placeholder")}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("price_dh")}</label>
              <input
                type="number"
                placeholder="0"
                className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("category")}</label>
              <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                <option value="">{t("choose")}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("city")}</label>
            <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option value="">{t("choose")}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold text-base">
            {t("publish_ad")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateAd;
