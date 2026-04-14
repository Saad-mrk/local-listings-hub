import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Mail, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode } = useUser();
  const { t } = useLanguage();

  const email = location.state?.email || sessionStorage.getItem("pendingEmail");
  const verificationCode = sessionStorage.getItem("verificationCode");

  const handleVerify = () => {
    setError("");
    if (!code) { setError(t("fill_all_fields")); return; }
    if (!email) { setError(t("invalid_email")); return; }
    if (verifyCode(code, email)) { navigate("/"); }
    else { setError(t("invalid_email")); setCode(""); }
  };

  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("verificationCode", newCode);
    console.log(`New verification code: ${newCode}`);
    setError("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/"><span className="text-3xl font-heading font-extrabold text-primary">LBAL</span></Link>
          <p className="text-muted-foreground text-sm mt-2">{t("verify_email_title")}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"><Mail className="h-8 w-8 text-primary" /></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t("verify_email_title")}</p>
            <p className="font-semibold text-sm">{email}</p>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{error}</div>}

          <div>
            <label className="text-sm font-medium mb-2 block">{t("verify_email_title")}</label>
            <input type="text" placeholder="000000" value={code}
              onChange={(e) => { const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6); setCode(value); }}
              maxLength={6} className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <Button onClick={handleVerify} className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">{t("sign_in")}</Button>

          <div className="text-center">
            <button onClick={handleResendCode} className="text-primary font-semibold hover:underline text-sm">{t("sign_up")}</button>
          </div>
        </div>

        <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />{t("back")}
        </Link>

        {verificationCode && (
          <div className="mt-6 bg-muted p-3 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Code:</p>
            <p className="font-mono">{verificationCode}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
