import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Mail, ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyCode } = useUser();

  const email = location.state?.email || sessionStorage.getItem("pendingEmail");
  const verificationCode = sessionStorage.getItem("verificationCode");

  const handleVerify = () => {
    setError("");

    if (!code) {
      setError("Veuillez entrer le code de vérification");
      return;
    }

    if (!email) {
      setError("Email manquant. Veuillez vous réinscrire.");
      return;
    }

    if (verifyCode(code, email)) {
      navigate("/");
    } else {
      setError("Code de vérification incorrect");
      setCode("");
    }
  };

  const handleResendCode = () => {
    // Generate new code (in production, would send email)
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("verificationCode", newCode);
    console.log(`New verification code: ${newCode}`);
    setError("");
    alert("Un nouveau code a été généré et affiché dans la console");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-3xl font-heading font-extrabold text-primary">
              LBAL
            </span>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">
            Vérifiez votre adresse email
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Nous avons envoyé un code de vérification à
            </p>
            <p className="font-semibold text-sm">{email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Code Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Code de vérification
            </label>
            <input
              type="text"
              placeholder="Entrez le code à 6 chiffres"
              value={code}
              onChange={(e) => {
                // Only allow numbers, max 6 digits
                const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
                setCode(value);
              }}
              maxLength={6}
              className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Vérifiez votre boîte email pour le code
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold"
          >
            Vérifier et accéder
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              onClick={handleResendCode}
              className="text-primary font-semibold hover:underline text-sm"
            >
              Renvoyer le code
            </button>
          </div>
        </div>

        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'inscription
        </Link>

        {/* Debug Info (Remove in production) */}
        {verificationCode && (
          <div className="mt-6 bg-muted p-3 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Code de test:</p>
            <p className="font-mono">{verificationCode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
