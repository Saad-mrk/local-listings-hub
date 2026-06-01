import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthForm } from "@/features/auth";
import { Home, Mail, Lock, User, Phone, ArrowRight } from "lucide-react"; // Import d'icônes pour le look

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_failed: "Connexion Google echouee. Veuillez reessayer.",
  invalid_token: "Token invalide recu depuis Google.",
  token_expired: "La session Google a expire. Veuillez reessayer.",
  invalid_claims: "Identite Google invalide. Veuillez reessayer.",
  access_denied: "Connexion Google annulee.",
};

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const {
    values,
    error,
    isLoading,
    setEmail,
    setPassword,
    setNom,
    setPrenom,
    setTelephone,
    setError,
    reset,
    submitRegister,
  } = useAuthForm();

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [errorMessage, setErrorMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorCode = params.get("error");

    if (!errorCode) {
      return;
    }

    setErrorMessage(GOOGLE_ERROR_MESSAGES[errorCode] ?? "Erreur d'authentification.");
  }, [location.search]);

  const handleLogin = async () => {
    if (isBlocked) return;
    setError("");
    setErrorMessage("");
    if (!values.email || !values.password) {
      setError(t("fill_all_fields"));
      return;
    }

    if (!validateEmail(values.email)) {
      setError(t("invalid_email"));
      return;
    }

    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      const status = axiosError?.response?.status;
      if (status === 429) {
        setIsBlocked(true);
        setCountdown(60);
        setErrorMessage("Trop de tentatives. Veuillez patienter 60s.");
      } else {
        setErrorMessage("Email ou mot de passe incorrect.");
      }
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!values.nom || !values.prenom || !values.email || !values.password || !values.telephone) {
      setError(t("fill_all_fields"));
      return;
    }

    if (!validateEmail(values.email)) {
      setError(t("invalid_email"));
      return;
    }

    if (values.password.length < 6) {
      setError(t("password_min"));
      return;
    }
    try {
      await submitRegister({
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
        telephone: values.telephone,
      });
      navigate("/verify-email", { state: { email: values.email } });
    } catch {
      // Registration error is handled by useAuthForm's error state
    }
  };

  const handleSubmit = async () => {
    if (isRegister) await handleRegister();
    else await handleLogin();
  };

  const handleGoogleLogin = () => {
    window.location.assign(`${env.apiUrl}/api/Auth/google-login`);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    intervalRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setIsBlocked(false);
          setErrorMessage("");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [countdown]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Bouton Home - Remplaçant de BackButton */}
      <div className="fixed top-6 left-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home size={18} />
            <span className="font-medium">Accueil</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 rounded-2xl bg-primary/10 mb-4"
          >
            <span className="text-4xl font-heading font-black text-primary tracking-tighter">
              LBAL
            </span>
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isRegister ? t("register_title") : t("login_title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Heureux de vous revoir parmi nous</p>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-xl shadow-primary/5 space-y-5">
          <AnimatePresence mode="wait">
            {(errorMessage || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-sm text-destructive font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                {errorMessage || error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                      {t("nom")}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <input
                        type="text"
                        value={values.nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                      {t("prenom")}
                    </label>
                    <input
                      type="text"
                      value={values.prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                      placeholder="John"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                      {t("telephone")}
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <input
                        type="tel"
                        value={values.telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                        placeholder="06 00 00 00 00"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                {t("email")}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isBlocked}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                {t("password")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="password"
                  value={values.password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBlocked}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || isBlocked}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
          >
            {isBlocked ? (
              `Attendez ${countdown}s`
            ) : isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isRegister ? t("sign_up") : t("sign_in")}
                <ArrowRight size={18} />
              </>
            )}
          </Button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="bg-card px-3">Ou</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 rounded-xl font-semibold border-border/70 gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continuer avec Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {isRegister ? t("already_have_account") : t("no_account")}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              reset();
            }}
            className="text-primary font-bold hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            {isRegister ? t("sign_in") : t("sign_up")}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
