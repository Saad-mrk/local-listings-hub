import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthForm } from "@/features/auth";

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
    submitLogin,
    submitRegister,
  } = useAuthForm();
  const navigate = useNavigate();
  const { login } = useUser();
  const { t } = useLanguage();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    setError("");
    if (!values.email || !values.password) {
      setError(t("fill_all_fields"));
      return;
    }
    if (!validateEmail(values.email)) {
      setError(t("invalid_email"));
      return;
    }

    try {
      const authResponse = await submitLogin({
        email: values.email,
        password: values.password,
      });
      login(authResponse);
      navigate("/");
    } catch {
      // Error message handled by hook (state + toast)
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
    } catch {
      // Error message handled by hook (state + toast)
    }
  };

  const handleSubmit = async () => {
    if (isRegister) await handleRegister();
    else await handleLogin();
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
            <span className="text-3xl font-heading font-extrabold text-primary">LBAL</span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegister ? t("register_title") : t("login_title")}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          {error && (
            <div
              role="alert"
              className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive"
            >
              {error}
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
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {isRegister && <p className="text-xs text-muted-foreground">{t("verification_note")}</p>}

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold"
          >
            {isLoading ? "..." : isRegister ? t("sign_up") : t("sign_in")}
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
