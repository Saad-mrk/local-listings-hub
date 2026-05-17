import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthForm } from "@/features/auth";

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Erreur de connexion";
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
  const { login } = useAuth();
  const { t } = useLanguage();

  const [errorMessage, setErrorMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    // prevent submitting while blocked
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
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;

      if (status === 429) {
        // Too many attempts: start 60s countdown and block form
        setIsBlocked(true);
        setCountdown(60);
        setErrorMessage(
          "You have made too many login attempts in the last minute. Please wait 60 seconds before trying again.",
        );
      } else if (status === 401) {
        // Unauthorized: show inline error, keep form enabled
        setErrorMessage("Incorrect email or password. Please try again.");
      } else {
        setError(getLoginErrorMessage(error));
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
      sessionStorage.setItem("pendingVerifyEmail", values.email);
      navigate("/verify-email", { state: { email: values.email } });
    } catch (error) {
      // Error message handled by hook (state + toast)
    }
  };

  const handleSubmit = async () => {
    if (isRegister) await handleRegister();
    else await handleLogin();
  };

  // Countdown effect: decrement every second while countdown > 0
  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    // ensure any existing interval is cleared
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          // clear and reset
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsBlocked(false);
          setErrorMessage("");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [countdown]);

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
            <span className="text-3xl font-heading font-extrabold text-primary">LBAL</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegister ? t("register_title") : t("login_title")}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          {(errorMessage || error) && (
            <div
              role="alert"
              className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive"
            >
              {errorMessage || error}
            </div>
          )}

          {isRegister && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("nom")}</label>
                <input
                  type="text"
                  placeholder={t("nom_placeholder")}
                  value={values.nom}
                  onChange={(e) => setNom(e.target.value)}
                  disabled={isBlocked}
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t("prenom")}</label>
                <input
                  type="text"
                  placeholder={t("prenom_placeholder")}
                  value={values.prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  disabled={isBlocked}
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">{t("telephone")}</label>
                <input
                  type="tel"
                  placeholder={t("telephone_placeholder")}
                  value={values.telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  disabled={isBlocked}
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("email")}</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={values.email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isBlocked}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("password")}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isBlocked}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {isRegister && <p className="text-xs text-muted-foreground">{t("verification_note")}</p>}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || isBlocked}
            className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold"
          >
            {isBlocked
              ? `Please wait... (${countdown}s)`
              : isLoading
                ? "..."
                : isRegister
                  ? t("sign_up")
                  : t("sign_in")}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          {isRegister ? t("already_have_account") : t("no_account")}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              reset();
            }}
            className="text-primary font-semibold hover:underline"
          >
            {isRegister ? t("sign_in") : t("sign_up")}
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
