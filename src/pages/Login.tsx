import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-heading font-extrabold text-primary">LBAL</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegister ? "Créer un nouveau compte" : "Connectez-vous à votre compte"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nom complet</label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">
            {isRegister ? "Créer le compte" : "Se connecter"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-semibold hover:underline">
            {isRegister ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
