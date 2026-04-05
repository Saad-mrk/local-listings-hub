import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, registerAndSendCode } = useUser();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    login(email, email.split("@")[0]);
    navigate("/");
  };

  const handleRegister = () => {
    setError("");

    if (!email || !password || !name) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    registerAndSendCode(email, name);
    navigate("/verify-email", { state: { email } });
  };

  const handleSubmit = () => {
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-heading font-extrabold text-primary">
              LBAL
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegister
              ? "Créer un nouveau compte"
              : "Connectez-vous à votre compte"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {isRegister && (
            <p className="text-xs text-muted-foreground">
              Lors de l'inscription, vous recevrez un code de vérification par
              email.
            </p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold"
          >
            {isRegister ? "S'inscrire" : "Se connecter"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="text-primary font-semibold hover:underline"
          >
            {isRegister ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
