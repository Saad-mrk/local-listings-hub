import { useState, useRef } from "react";
import { Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const categories = ["Véhicules", "Immobilier", "Téléphones", "Informatique", "Maison", "Mode", "Emploi", "Sports"];
const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"];

const CreateAd = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newImages].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <h1 className="text-2xl font-heading font-bold mb-6">Publier une annonce</h1>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
          {/* Images */}
          <div>
            <label className="text-sm font-medium mb-2 block">Photos (max 6)</label>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img src={img} alt="" className="w-full h-full object-cover" />
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
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  onDragOver={(e) => e.preventDefault()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Ajouter</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {/* Fields */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Titre</label>
            <input type="text" placeholder="Ex: iPhone 15 Pro Max" className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea rows={4} placeholder="Décrivez votre article..." className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Prix (DH)</label>
              <input type="number" placeholder="0" className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Catégorie</label>
              <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                <option value="">Choisir</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Ville</label>
            <select className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option value="">Choisir</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Button className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold text-base">
            Publier l'annonce
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAd;
